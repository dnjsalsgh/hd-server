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
  Repository,
  TypeORMError,
} from 'typeorm';
import { AmrCharger } from '../amr-charger/entities/amr-charger.entity';
import { AmrChargeHistory } from '../amr-charge-history/entities/amr-charge-history.entity';
import { CreateAmrChargerDto } from '../amr-charger/dto/create-amr-charger.dto';
import { CreateAmrChargeHistoryDto } from '../amr-charge-history/dto/create-amr-charge-history.dto';
import { ClientProxy } from '@nestjs/microservices';
import { take } from 'rxjs';
import { orderByUtil } from '../lib/util/orderBy.util';
import { Hacs } from '../hacs/entities/hacs.entity';
import { LoggerService } from '../lib/logger/logger.service';
import dayjs from 'dayjs';
import { AlarmService } from '../alarm/alarm.service';
import { amrErrorData } from '../worker/amrErrorData';
import process from 'process';

@Injectable()
export class AmrService {
  constructor(
    @InjectRepository(Amr) private readonly amrRepository: Repository<Amr>,
    @InjectRepository(AmrCharger)
    private readonly amrChargerRepository: Repository<AmrCharger>,
    @InjectRepository(AmrChargeHistory)
    private readonly amrChargeHistoryRepository: Repository<AmrChargeHistory>,
    private dataSource: DataSource,
    @Inject('MQTT_SERVICE') private client: ClientProxy,
    @InjectRepository(Hacs, 'amrDB')
    private readonly hacsRepository: Repository<Hacs>,
    private readonly loggerService: LoggerService,
    private readonly alarmService: AlarmService,
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
    if (process.env.AMRLATENCY === 'true') {
      console.log(`ACS DB로부터 데이터 수집 ${new Date().toISOString()}`);
    }

    const amrDataList = await this.hacsRepository.find({
      // where: { Connected: 1 },
      order: { LogDT: 'DESC' },
      take: 5, // 최소한만 가져오려고 함(6 개)
    });

    if (!amrDataList) {
      return;
    }

    if (process.env.AMRLATENCY === 'true') {
      console.log(`ACS mqtt로 publish ${new Date().toISOString()}`);
    }

    // amr실시간 데이터 mqtt로 publish 하기 위함
    this.client
      .send(`hyundai/amr/realData`, amrDataList)
      .pipe(take(1))
      .subscribe();

    // amr 5대 데이터 전부 이력 관리를 위한 for문
    for (const amrData of amrDataList) {
      const amrBody: CreateAmrDto = {
        name: amrData?.Amrld?.toString() || '', // 로봇 번호
        logDT: amrData?.LogDT || new Date().toISOString(), // 데이터 업데이트 일자
        charging: amrData?.CurState === 'Charge', // 마지막 amr의 배터리량과 현재 배터리량의 비교로 [충전중] 판단
        // prcsCD: amrData.PrcsCD,
        // ACSMode: amrData.ACSMode === 1,
        mode: amrData?.Mode,
        // errorLevel: amrData.ErrorLevel,
        errorCode: amrData?.ErrorCode?.toString() || '',
        soc: amrData?.SOC,
        travelDist: amrData?.TravelDist, // 누적이동거리(m)
        oprTime: amrData?.OprTime, // 누적운행시간(M)
        stopTime: amrData?.StopTime, // 누적정지시간(M)
        startBatteryLevel: amrData?.StartBatteryLevel, // 충전을 시작할 때만 입력하기
        // lastBatteryLevel: amrData.LastBatteryLevel,
        simulation: true,
        // distinguish: amrData?.distinguish, // 인입용 인출용 구분
        MissionNo: amrData?.JobNm,
        Missionld: amrData?.JobId,
      };

      // amr의 에러code가 오면 그 에러 코드로 알람 발생
      await this.makeAmrAlarm(amrData);

      const amrChargerBody: CreateAmrChargerDto = {
        name: amrData.Amrld.toString(),
        working: amrData?.CurState === 'Charge',
        // x: amrData?.ChargeX, // 유니티에서 보여지는 amr의 x좌표
        // y: amrData?.ChargeY, // 유니티에서 보여지는 amr의 y좌표
        // z: amrData?.ChargeZ, // 유니티에서 보여지는 amr의 z좌표
      };

      const amrChargeHistoryBody: CreateAmrChargeHistoryDto = {
        chargeStart: amrData?.StartTime || new Date(),
        chargeEnd: amrData?.EndTime || new Date(),
        soc: amrData.SOC?.toString(),
        soh: amrData.SOH?.toString(),
        // 밑쪽 로직에서 값 주입되어서 기본값 null
        amr: null,
        amrCharger: null,
      };

      // const queryRunner = await this.dataSource.createQueryRunner();
      // await queryRunner.connect();
      // await queryRunner.startTransaction();

      try {
        // 로봇의 상태 데이터를 업데이트 하기 위해 시간 데이터들 중 name이 같으면 update를 침
        if (process.env.AMRLATENCY === 'true') {
          console.log(`AMR TABLE에 데이터 저장 ${new Date().toISOString()}`);
        }
        // const amrResult = await this.amrRepository.upsert(amrBody, ['name']);
        const amrResult = await this.amrRepository.update(
          { name: amrBody.name },
          amrBody,
        );

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
        //
        //   await this.amrChargeHistoryRepository.save(amrChargeHistoryBody);
        //   // await queryRunner.manager
        //   //   .getRepository(AmrChargeHistory)
        //   //   .save(amrChargeHistoryBody);
        // }

        // await queryRunner.commitTransaction();
      } catch (error) {
        // await queryRunner.rollbackTransaction();
        // await queryRunner.release();
        throw new TypeORMError(`rollback Working - ${error}`);
      } finally {
        // await queryRunner.release();
      }
    }
  }

  private async makeAmrAlarm(amrData: Hacs) {
    if (!amrErrorData[amrData?.ErrorCode]) {
      return;
    }

    const previousAmrBody = await this.alarmService.getPreviousAlarmState(
      amrData?.AMRNM,
      amrErrorData[amrData?.ErrorCode],
    );

    if (previousAmrBody) {
      await this.alarmService.changeAlarm(previousAmrBody, true);
    } else if (
      !previousAmrBody
      // &&
      // amrData?.ErrorCode !== null &&
      // amrErrorData[amrData?.ErrorCode] !== undefined &&
      // previousAmrBody.alarmMessage !== amrErrorData[amrData?.ErrorCode]
      // amrErrorData[amrData?.ErrorCode] !== previousAmrBody.alarmMessage
    ) {
      await this.alarmService.create({
        equipmentName: amrData?.AMRNM,
        stopTime: new Date(),
        count: 1,
        alarmMessage: amrErrorData[amrData?.ErrorCode],
        done: false,
      });
    }
  }

  findAll(
    name?: string,
    charging?: boolean,
    prcsCD?: string,
    ACSMode?: boolean,
    mode?: number,
    errorLevel?: number,
    errorCode?: string,
    startTimeFrom?: Date,
    startTimeTo?: Date,
    endTimeFrom?: Date,
    endTimeTo?: Date,
    travelDist?: number,
    oprTime?: number,
    stopTime?: number,
    startBatteryLevel?: number,
    lastBatteryLevel?: number,
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

    let findStartDate: FindOperator<Date>;
    if (startTimeFrom && startTimeTo) {
      findStartDate = Between(startTimeFrom, startTimeTo);
    } else if (startTimeFrom) {
      findStartDate = MoreThanOrEqual(startTimeFrom);
    } else if (startTimeTo) {
      findStartDate = LessThanOrEqual(startTimeTo);
    }

    let findEndDate: FindOperator<Date>;
    if (endTimeFrom && endTimeTo) {
      findEndDate = Between(endTimeFrom, endTimeTo);
    } else if (endTimeFrom) {
      findEndDate = MoreThanOrEqual(endTimeFrom);
    } else if (endTimeTo) {
      findEndDate = LessThanOrEqual(endTimeTo);
    }

    return this.amrRepository.find({
      where: {
        name: name,
        charging: charging,
        // prcsCD: prcsCD,
        // ACSMode: ACSMode,
        mode: mode,
        // errorLevel: errorLevel,
        errorCode: errorCode,
        // startTime: findStartDate,
        // endTime: findEndDate,
        travelDist: travelDist,
        oprTime: oprTime,
        stopTime: stopTime,
        startBatteryLevel: startBatteryLevel,
        // lastBatteryLevel: lastBatteryLevel,
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

  // 체적이 없는 화물을 검색하는 메서드
  async getAwbInAmr() {
    // 오늘 날짜의 시작과 끝을 구하고, KST로 변환합니다 (UTC+9).
    const todayStart = dayjs().startOf('day').add(9, 'hour').toDate();
    const todayEnd = dayjs().endOf('day').add(9, 'hour').toDate();

    return await this.amrRepository.find({
      where: {
        createdAt: Between(todayStart, todayEnd),
        // width: IsNull(), // modelPath가 null인 경우
        // simulation: false, // simulation이 false인 경우
      },
      order: orderByUtil(null),
      // take: limitNumber,
    });
  }
}
