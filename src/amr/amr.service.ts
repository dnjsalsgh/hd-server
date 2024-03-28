import { Inject, Injectable } from '@nestjs/common';
import { CreateAmrDto } from './dto/create-amr.dto';
import { UpdateAmrDto } from './dto/update-amr.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Amr } from './entities/amr.entity';
import {
  Between,
  DataSource,
  FindOperator,
  LessThanOrEqual,
  MoreThanOrEqual,
  QueryRunner,
  Repository,
  TypeORMError,
} from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { take } from 'rxjs';
import { orderByUtil } from '../lib/util/orderBy.util';
import { Hacs } from '../hacs/entities/hacs.entity';
import dayjs from 'dayjs';
import { amrErrorData } from '../worker/amrErrorData';
import { RedisService } from '../redis/redis.service';
import { isOneDayDifference } from '../lib/util/isOneDayDifference';
import { Alarm } from '../alarm/entities/alarm.entity';
import { CreateAmrChargerDto } from '../amr-charger/dto/create-amr-charger.dto';
import { CreateAmrChargeHistoryDto } from '../amr-charge-history/dto/create-amr-charge-history.dto';

@Injectable()
export class AmrService {
  constructor(
    @InjectRepository(Amr) private readonly amrRepository: Repository<Amr>,

    private dataSource: DataSource,
    @Inject('MQTT_SERVICE') private client: ClientProxy,
    @InjectRepository(Hacs, 'amrDB')
    private readonly hacsRepository: Repository<Hacs>,
    private redisService: RedisService,
  ) {}

  create(createAmrDto: CreateAmrDto) {
    return this.amrRepository.save(createAmrDto);
  }

  /**
   * v1.2
   * 실시간으로 ms-sql에서 오는 데이터를 가져다가 postgresSQL에 저장하기 위함 with 충전, 충전 데이터
   * @param body
   */
  async createAmrByHacs() {
    const amrDataList = await this.hacsRepository.find({
      // where: { Connected: 1 },
      order: { LogDT: 'DESC' },
      take: 5, // 최소한만 가져오려고 함(5 개)
    });

    if (!amrDataList) {
      return;
    }

    // amr실시간 데이터 mqtt로 publish 하기 위함
    this.client
      .send(`hyundai/amr/realData`, amrDataList)
      .pipe(take(1))
      .subscribe();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // amr 5대 데이터 전부 이력 관리를 위한 for문
      for (const amrData of amrDataList) {
        const amrBody: CreateAmrDto = {
          name: amrData?.Amrld?.toString() || '', // 로봇 번호
          logDT: amrData?.LogDT || new Date().toISOString(), // 데이터 업데이트 일자
          charging: amrData?.CurState === 'Charge',
          mode: amrData?.Mode,
          errorCode: amrData?.ErrorCode?.toString() || '',
          soc: amrData?.SOC,
          travelDist: amrData?.TravelDist, // 누적이동거리(m)
          oprTime: amrData?.OprTime, // 누적운행시간(M)
          stopTime: amrData?.StopTime, // 누적정지시간(M)
          startBatteryLevel: amrData?.StartBatteryLevel, // 충전을 시작할 때만 입력하기
          simulation: true,
        };

        const amrResult = await this.amrRepository.upsert(amrBody, ['name']);

        const amrChargerBody: CreateAmrChargerDto = {
          name: amrData.Amrld.toString(),
          working: amrData?.CurState === 'Charge',
        };

        const amrChargeHistoryBody: CreateAmrChargeHistoryDto = {
          chargeStart: amrData?.StartTime || new Date(),
          chargeEnd: amrData?.EndTime || new Date(),
          soc: amrData.SOC?.toString(),
          soh: amrData.SOH?.toString(),
          amr: null,
          amrCharger: null,
        };

        // const amrChargerResult = await this.amrChargerRepository.upsert(
        //   amrChargerBody,
        //   ['name'],
        // );

        // 로봇의 상태 데이터를 업데이트 하기 위해 시간 데이터들 중 name이 같으면 update를 침
        // Amr 생성, amr충전 생성 될 시에만 이력 저장
        // if (
        //   amrResult.identifiers[0].id &&
        //   amrChargerResult.identifiers[0].id &&
        //   amrBody.charging
        // ) {
        //   amrChargeHistoryBody.amr = amrResult.identifiers[0].id;
        //   amrChargeHistoryBody.amrCharger = amrChargerResult.identifiers[0].id;
        //   await this.amrChargeHistoryRepository.save(amrChargeHistoryBody)
        //   await this.amrChargeHistoryRepository.upsert(amrChargeHistoryBody, [
        //     'amr',
        //     'amrCharger',
        //   ]);
        // }
      }

      // amr의 에러code가 오면 그 에러 코드로 알람 발생
      await this.makeAmrAlarm(amrDataList, queryRunner);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new TypeORMError(`rollback Working - ${error}`);
    } finally {
      await queryRunner.release();
    }
  }

  public async makeAmrAlarm(acsList: Hacs[], queryRunner: QueryRunner) {
    for (const acs of acsList) {
      if (!amrErrorData[acs?.ErrorCode]) {
        return;
      }

      const now = new Date().toISOString();
      // 오후 11시 설정
      const elevenPM = dayjs(now).hour(23).minute(0).second(0);

      // 아침 7시 설정
      const sevenAM = dayjs(now).add(1, 'day').hour(7).minute(0).second(0);

      // 현재 시간이 오후 11시부터 다음 날 아침 7시 사이인지 확인
      const isBetweenElevenPMAndSevenAM =
        dayjs(now).isAfter(elevenPM) && dayjs(now).isBefore(sevenAM);

      // 오후 11시 부터 오전 7시까지 amr의 알람 생성을 금지함
      // [폐기] 전원 off면 에러처리 안함
      if (
        isBetweenElevenPMAndSevenAM
        // && acs?.ErrorCode === 3
      ) {
        return;
      }

      const errorCodeNumber = acs?.ErrorCode;
      const previousAmrErrorCode = await this.redisService.getHash(
        `${acs.AMRNM}`,
        'errorCodeNumber',
      );
      const previousAmrCount = await this.redisService.getHash(
        `${acs.AMRNM}`,
        'count',
      );
      const previousAlarmId = await this.redisService.getHash(
        `${acs.AMRNM}`,
        'alarmId',
      );
      const previousAlarmCreatedAt = await this.redisService.getHash(
        `${acs.AMRNM}`,
        'createdAt',
      );

      // 처음 알람이 발생하면 들어가면 알람 정보 redis에 세팅하기
      if (!previousAmrErrorCode) {
        await this.redisService.setHash(
          `${acs.AMRNM}`,
          'errorCodeNumber',
          acs?.ErrorCode,
        );
        await this.redisService.setHash(`${acs.AMRNM}`, 'count', 1);
        await this.redisService.setHash(`${acs.AMRNM}`, 'createdAt', now);
      }

      // const previousAmrBody = await this.alarmService.getPreviousAlarmState(
      //   acs?.AMRNM,
      //   amrErrorData[acs?.ErrorCode],
      // );

      // 이전의 알람과 현재의 알람이 다르다면 create
      if (
        +previousAmrErrorCode !== errorCodeNumber ||
        isOneDayDifference(previousAlarmCreatedAt, new Date().toISOString())
      ) {
        const alarm = await queryRunner.manager.getRepository(Alarm).save({
          equipmentName: acs?.AMRNM,
          stopTime: new Date(),
          count: 1,
          alarmMessage: amrErrorData[acs?.ErrorCode],
          done: false,
        });
        this.client
          .send(`hyundai/alarm/insert`, alarm.id)
          .pipe(take(1))
          .subscribe();

        // 처음 만들 때 알람 정보를 redis에 세팅하기
        await this.redisService.setHash(
          `${acs.AMRNM}`,
          'errorCodeNumber',
          acs?.ErrorCode,
        );
        await this.redisService.setHash(`${acs.AMRNM}`, 'count', 1);
        await this.redisService.setHash(`${acs.AMRNM}`, 'alarmId', alarm.id);
        await this.redisService.setHash(`${acs.AMRNM}`, 'createdAt', now);
      }
      // 이전 에러와 동일한 에러가 들어올 때
      else if (+previousAmrErrorCode === errorCodeNumber) {
        await queryRunner.manager.getRepository(Alarm).update(
          {
            id: Number(previousAlarmId),
          },
          {
            count: Number(previousAmrCount) + 1,
          },
        );
        // 이전 count + 1 해주기
        await this.redisService.setHash(
          `${acs.AMRNM}`,
          'count',
          Number(previousAmrCount) + 1,
        );
      }
    }
  }

  findAll(
    name?: string,
    charging?: boolean,
    mode?: number,
    errorCode?: string,
    travelDist?: number,
    oprTime?: number,
    stopTime?: number,
    startBatteryLevel?: number,
    simulation?: boolean,
    logDT?: string,
    distinguish?: string,
    createdAtFrom?: Date,
    createdAtTo?: Date,
    order?: string,
    limit?: number,
    offset?: number,
  ) {
    let findDate: FindOperator<Date>;
    if (createdAtFrom && createdAtTo) {
      findDate = Between(createdAtFrom, createdAtTo);
    } else if (createdAtFrom) {
      findDate = MoreThanOrEqual(createdAtFrom);
    } else if (createdAtTo) {
      findDate = LessThanOrEqual(createdAtTo);
    }

    return this.amrRepository.find({
      where: {
        name: name,
        charging: charging,
        mode: mode,
        errorCode: errorCode,
        travelDist: travelDist,
        oprTime: oprTime,
        stopTime: stopTime,
        startBatteryLevel: startBatteryLevel,
        simulation: simulation,
        logDT: logDT,
        distinguish: distinguish,
        createdAt: findDate,
      },
      order: orderByUtil(order),
      take: limit,
      skip: offset,
    });
  }

  findOne(id: number) {
    return this.amrRepository.find({
      where: { id: id },
      relations: { timeTables: true },
    });
  }

  update(id: number, updateAmrDto: UpdateAmrDto) {
    return this.amrRepository.update(id, updateAmrDto);
  }

  remove(id: number) {
    return this.amrRepository.delete(id);
  }

  removeRedis(amrNumber: string) {
    return this.redisService.deleteAllFieldsInHash(amrNumber);
  }
}
