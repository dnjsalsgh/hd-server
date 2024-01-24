import {
  Between,
  DataSource,
  Equal,
  FindOperator,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
  TypeORMError,
} from 'typeorm';
import { take } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateSkidPlatformAndAsrsPlcDto } from './dto/plc-data-intersection.dto';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { CreateSkidPlatformHistoryDto } from './dto/create-skid-platform-history.dto';
import { UpdateSkidPlatformHistoryDto } from './dto/update-skid-platform-history.dto';
import { CreateAsrsPlcDto } from '../asrs/dto/create-asrs-plc.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SkidPlatformHistory } from './entities/skid-platform-history.entity';
import { Awb, AwbAttribute } from '../awb/entities/awb.entity';
import { AsrsAttribute } from '../asrs/entities/asrs.entity';
import {
  SkidPlatform,
  SkidPlatformAttribute,
} from '../skid-platform/entities/skid-platform.entity';
import {
  AsrsOutOrder,
  AsrsOutOrderAttribute,
} from '../asrs-out-order/entities/asrs-out-order.entity';
import { RedisService } from '../redis/redis.service';
import { orderByUtil } from '../lib/util/orderBy.util';
import { AwbService } from '../awb/awb.service';
import { AwbUtilService } from '../awb/awbUtil.service';

@Injectable()
export class SkidPlatformHistoryService {
  constructor(
    @InjectRepository(SkidPlatformHistory)
    private readonly skidPlatformHistoryRepository: Repository<SkidPlatformHistory>,
    @InjectRepository(AsrsOutOrder)
    private readonly asrsOutOrderRepository: Repository<AsrsOutOrder>,
    @InjectRepository(Awb)
    private readonly awbRepository: Repository<Awb>,
    private dataSource: DataSource,
    private redisService: RedisService,
    @Inject('MQTT_SERVICE') private client: ClientProxy,
  ) {}

  async create(createSkidPlatformHistoryDto: CreateSkidPlatformHistoryDto) {
    const historyData = await this.getProcessedData(
      createSkidPlatformHistoryDto,
    );

    const historyResult = await this.skidPlatformHistoryRepository.save(
      historyData as SkidPlatformHistory,
    );

    const skidPlatformNowState = await this.nowState();

    // 현재 안착대에 어떤 화물이 들어왔는지 파악하기 위한 mqtt 전송 [작업지시 화면에서 필요함]
    this.client
      .send(`hyundai/skidPlatform/insert`, {
        statusCode: 200,
        message: 'current skidPlatform state',
        data: skidPlatformNowState,
      })
      .pipe(take(1))
      .subscribe();
    return historyResult;
  }

  private async getProcessedData(historyData: CreateSkidPlatformHistoryDto) {
    const existingHistory = await this.findExistingHistory(historyData);

    if (!existingHistory) {
      historyData.totalCount = historyData.count;
      return historyData;
    }

    this.updateHistoryData(existingHistory, historyData);
    return historyData;
  }

  private async findExistingHistory(historyData: CreateSkidPlatformHistoryDto) {
    return this.findHistoryByPlatform(
      historyData.SkidPlatform,
      historyData.Awb,
    );
  }

  private updateHistoryData(
    existingHistory: SkidPlatformHistory,
    historyData: CreateSkidPlatformHistoryDto,
  ) {
    historyData.totalCount = existingHistory.totalCount;

    if (historyData.inOutType === 'out') {
      historyData.count = existingHistory.count - historyData.count;
    }

    // 안착대에 똑같은 값이 in 되면 팅기게끔 수정
    // if (historyData.inOutType === 'in') {
    //   historyData.count = (existingHistory.Awb as Awb).piece;
    // }
  }

  async findAll(query: SkidPlatformHistory & BasicQueryParamDto) {
    // createdAt 기간검색 처리
    const { createdAtFrom, createdAtTo } = query;
    let findDate: FindOperator<Date>;
    if (createdAtFrom && createdAtTo) {
      findDate = Between(createdAtFrom, createdAtTo);
    } else if (createdAtFrom) {
      findDate = MoreThanOrEqual(createdAtFrom);
    } else if (createdAtTo) {
      findDate = LessThanOrEqual(createdAtTo);
    }
    return await this.skidPlatformHistoryRepository.find({
      select: {
        Awb: AwbAttribute,
        Asrs: AsrsAttribute,
        SkidPlatform: SkidPlatformAttribute,
        AsrsOutOrder: {
          ...AsrsOutOrderAttribute,
          Awb: AwbAttribute,
          Asrs: AsrsAttribute,
          SkidPlatform: SkidPlatformAttribute,
        },
      },
      relations: {
        Awb: true,
        Asrs: true,
        SkidPlatform: true,
        AsrsOutOrder: {
          Awb: true,
          Asrs: true,
          SkidPlatform: true,
        },
      },
      where: {
        // join 되는 테이블들의 FK를 typeorm 옵션에 맞추기위한 조정하기 위한 과정
        Asrs: query.Asrs ? Equal(+query.Asrs) : undefined,
        Awb: query.Awb ? Equal(+query.Awb) : undefined,
        SkidPlatform: query.SkidPlatform
          ? Equal(+query.SkidPlatform)
          : undefined,
        AsrsOutOrder: query.AsrsOutOrder
          ? Equal(+query.AsrsOutOrder)
          : undefined,
        createdAt: findDate,
      },
      order: orderByUtil(query.order),
      take: query.limit,
      skip: query.offset,
    });
  }

  async findOne(id: number) {
    const result = await this.skidPlatformHistoryRepository.findOne({
      where: { id: id },
      select: {
        Awb: AwbAttribute,
        Asrs: AsrsAttribute,
        SkidPlatform: SkidPlatformAttribute,
        AsrsOutOrder: {
          ...AsrsOutOrderAttribute,
          Awb: AwbAttribute,
          Asrs: AsrsAttribute,
          SkidPlatform: SkidPlatformAttribute,
        },
      },
      relations: {
        Awb: true,
        Asrs: true,
        SkidPlatform: true,
        AsrsOutOrder: {
          Awb: true,
          Asrs: true,
          SkidPlatform: true,
        },
      },
      order: orderByUtil(null),
    });
    return result;
  }

  async findHistoryByPlatform(skidPlatformId: number, awbId: number) {
    const [result] = await this.skidPlatformHistoryRepository.find({
      where: {
        SkidPlatform: skidPlatformId ? Equal(+skidPlatformId) : undefined,
        Awb: awbId ? Equal(+awbId) : undefined,
      },
      select: {
        Awb: AwbAttribute,
        Asrs: AsrsAttribute,
        SkidPlatform: SkidPlatformAttribute,
        AsrsOutOrder: {
          ...AsrsOutOrderAttribute,
          Awb: AwbAttribute,
          Asrs: AsrsAttribute,
          SkidPlatform: SkidPlatformAttribute,
        },
      },
      relations: {
        Awb: true,
        Asrs: true,
        SkidPlatform: true,
        AsrsOutOrder: {
          Awb: true,
          Asrs: true,
          SkidPlatform: true,
        },
      },
      order: orderByUtil(null),
    });
    return result;
  }

  /**
   * 안착대 이력에서 skid_platform_id를 기준으로 최신 안착대의 상태만 가져옴
   */
  async nowState() {
    const skidPlatfromState = await this.skidPlatformHistoryRepository
      .createQueryBuilder('sph')
      .distinctOn(['sph.skid_platform_id'])
      .leftJoinAndSelect('sph.SkidPlatform', 'SkidPlatform')
      .leftJoinAndSelect('sph.Asrs', 'Asrs')
      .leftJoinAndSelect('sph.Awb', 'Awb')
      .leftJoinAndSelect('Awb.Scc', 'Scc') // awb의 Scc를 반환합니다.
      // .where('sph.inOutType = :type', { type: 'in' })
      .orderBy('sph.skid_platform_id')
      .addOrderBy('sph.id', 'DESC')
      .getMany(); // 또는 getMany()를 사용하여 엔터티로 결과를 가져올 수 있습니다.
    // return skidPlatfromState.filter((v) => v.inOutType === 'in');
    return skidPlatfromState.filter((v) => v.count >= 0);
  }

  // 안착대 이력에서 skid_platform_id를 기준으로 가상포트의 최신 안착대의 상태만 가져옴
  async nowVirtualState(virtual: boolean, onlyIn = false) {
    const virtualState = await this.skidPlatformHistoryRepository
      .createQueryBuilder('sph')
      .distinctOn(['sph.skid_platform_id'])
      .leftJoinAndSelect('sph.SkidPlatform', 'SkidPlatform')
      .leftJoinAndSelect('sph.Asrs', 'Asrs')
      .leftJoinAndSelect('sph.Awb', 'Awb')
      .leftJoinAndSelect('Awb.Scc', 'Scc') // awb의 Scc를 반환합니다.
      .where('SkidPlatform.virtual = :virtual', { virtual: virtual })
      .orderBy('sph.skid_platform_id')
      .addOrderBy('sph.id', 'DESC')
      .getMany(); // 또는 getMany()를 사용하여 엔터티로 결과를 가져올 수 있습니다.

    if (onlyIn) {
      return virtualState.filter((v) => v.inOutType === 'in');
    }

    // 각 skidPlatformHistory 객체에 Awbs 필드를 추가합니다.
    for (const skidPlatformHistory of virtualState) {
      const awbs = await this.awbRepository.find({
        where: [{ parent: (skidPlatformHistory.Awb as Awb).id }],
        relations: {
          Scc: true,
          // AirCraftSchedules: true,
        },
      });
      skidPlatformHistory.Awb['Children'] = awbs; // Awbs 필드를 추가
    }
    return virtualState;
  }

  /**
   * 빈 안착대 id 가져오기
   */
  async getEmptySkidPlatform() {
    const skidPlatfromState = await this.skidPlatformHistoryRepository
      .createQueryBuilder('sph')
      .distinctOn(['sph.skid_platform_id'])
      .leftJoinAndSelect('sph.SkidPlatform', 'SkidPlatform')
      // .where('sph.inOutType = :type', { type: 'out' })
      .andWhere('SkidPlatform.virtual = :virtual', { virtual: false })
      .orderBy('sph.skid_platform_id')
      .addOrderBy('sph.id', 'DESC')
      .getMany(); // 또는 getMany()를 사용하여 엔터티로 결과를 가져올 수 있습니다.
    return skidPlatfromState.filter((v) => v.inOutType === 'out');
  }

  /**
   * 안착대 이력에서 skidPlatform_id를 기준으로 최신 안착대의 'in' 상태인거 모두 삭제
   */
  async resetSkidPlatform() {
    const skidPlatfromState = await this.skidPlatformHistoryRepository
      .createQueryBuilder('sph')
      .distinctOn(['sph.skid_platform_id'])
      .leftJoinAndSelect('sph.SkidPlatform', 'SkidPlatform')
      .leftJoinAndSelect('sph.Asrs', 'Asrs')
      .leftJoinAndSelect('sph.Awb', 'Awb')
      .leftJoinAndSelect('Awb.Scc', 'Scc') // awb의 Scc를 반환합니다.
      // .where('sph.inOutType = :type', { type: 'in' })
      .orderBy('sph.skid_platform_id')
      .addOrderBy('sph.id', 'DESC')
      .getMany(); // 또는 getMany()를 사용하여 엔터티로 결과를 가져올 수 있습니다.

    const skidPlatformIds = skidPlatfromState.map(
      (skidPlatformHistory) =>
        (skidPlatformHistory.SkidPlatform as SkidPlatform).id,
    );
    const awbIds = skidPlatfromState.map(
      (skidPlatformHistory) => (skidPlatformHistory.Awb as Awb).id,
    );
    if (
      skidPlatformIds &&
      skidPlatformIds.length > 0 &&
      awbIds &&
      awbIds.length > 0
    ) {
      const deleteResult = await this.skidPlatformHistoryRepository
        .createQueryBuilder()
        .delete()
        .where('SkidPlatform IN (:...skidPlatformIds)', { skidPlatformIds })
        .andWhere('Awb IN (:...awbIds)', { awbIds })
        .execute();
      return deleteResult;
    }
    return '안착대가 비었습니다.';
  }

  async resetSkidPlatformAll() {
    const skidPlatformResult = await this.skidPlatformHistoryRepository.delete(
      {},
    );

    return '안착대가 비었습니다.';
  }

  update(
    id: number,
    updateSkidPlatformHistoryDto: UpdateSkidPlatformHistoryDto,
  ) {
    return this.skidPlatformHistoryRepository.update(
      id,
      updateSkidPlatformHistoryDto as SkidPlatformHistory,
    );
  }

  remove(id: number) {
    return this.skidPlatformHistoryRepository.delete(id);
  }

  // plc의 데이터중 안착대 화물정보가 변경되었을 때 안착대 이력을 등록하기 위함입니다.
  async checkSkidPlatformChange(body: CreateSkidPlatformAndAsrsPlcDto) {
    for (let unitNumber = 1; unitNumber <= 4; unitNumber++) {
      const unitKey = this.formatUnitNumber(unitNumber);
      const previousState = await this.redisService.get(
        `p${unitNumber.toString()}`,
      );
      const onOffTag = `SUPPLY_01_${unitKey}_P2A_G_SKID_ON`; // 화물의 유무
      // const offTag = `SUPPLY_01_${unitKey}_P2A_D_SKID_ON`; // 스키드의 유무
      const onOffSignal = this.checkOnOff(body, onOffTag);
      const awbNo = `SUPPLY_01_${unitKey}_P2A_Bill_No`;
      const separateNumber = `SUPPLY_01_${unitKey}_P2A_SEPARATION_NO`;
      const variableInOut = onOffSignal ? 'in' : 'out';

      // 빈 바코드 있을 때 다음걸로 넘어가기
      if (body[awbNo] === '') {
        continue;
      }
      console.log('body[awbNo] = 안착대 awbBarcode', body[awbNo]);
      if (this.shouldSetInOutSkidPlatform(onOffSignal, previousState)) {
        await this.processInOut(
          unitNumber,
          body[awbNo],
          body[separateNumber],
          variableInOut,
        );
      }
    }
  }

  // plc로 오는 데이터가 2자리 수로 맞춰놔서 convert 함수
  formatUnitNumber(unitNumber: number): string {
    return unitNumber.toString().padStart(2, '0');
  }

  // on/off의 값을 return 하는 함수
  checkOnOff(body: CreateSkidPlatformAndAsrsPlcDto, onOffTag: string) {
    return body[onOffTag];
  }

  // in으로 상태 변경하는 메서드
  shouldSetInSkidPlatform(
    body: CreateSkidPlatformAndAsrsPlcDto,
    onTag: string,
    previousState: string | null,
  ): boolean {
    return body[onTag] && (previousState === 'out' || previousState === null);
  }

  // out으로 상태 변경하는 메서드
  shouldSetOutSkidPlatform(
    body: CreateAsrsPlcDto,
    offTag: string,
    previousState: string | null,
  ): boolean {
    return body[offTag] && previousState === 'in';
  }

  // in인지 out 인지 return 하는 함수
  shouldSetInOutSkidPlatform(
    onOffSignal: boolean,
    previousState: string | null,
  ): boolean {
    // 'in'
    if (onOffSignal) {
      return previousState === 'out' || previousState === null;
    }
    // 'out'
    else {
      return previousState === 'in';
    }
  }

  /**
   * in인지 out 인지 판단 후 현재 상황은 redis에 저장
   * 저장된 값은 이전의 상태를 판단하기 위함
   */
  async processInOut(
    unitNumber: number,
    awbNo: string,
    separateNumber: number,
    state: 'in' | 'out',
  ) {
    try {
      const awb = await this.findAwbByBarcode(awbNo, separateNumber);
      const inOutType = state === 'in' ? 'in' : 'out';

      if (!(awb && awb.id)) {
        throw new TypeORMError('awb 정보를 찾지 못했습니다.');
      }

      await this.recordOperation(unitNumber, awb, inOutType);
    } catch (error) {
      console.error(error.message);
    }
  }

  // 실제로 skidPlatformHistory db에 저장하는 메서드
  async recordOperation(
    SkidPlatformId: number,
    awb: Awb,
    inOutType: 'in' | 'out',
  ) {
    try {
      const asrsHistoryBody: CreateSkidPlatformHistoryDto = {
        inOutType,
        Awb: awb.id,
        SkidPlatform: SkidPlatformId,
        count: awb.piece, // plc에서 들어오는 정보로 변경해야 할 지 고민
        totalCount: awb.awbTotalPiece,
      };

      const skidPlatformHistoryFormIf =
        await this.skidPlatformHistoryRepository.save(asrsHistoryBody);

      // asrsHistory에 입력이 성공 했다면
      if (skidPlatformHistoryFormIf) {
        await this.awbRepository.update(awb.id, { state: 'inskidplatform' });
      }

      // skidPlatformHistory를 mqtt에 보내기 위함
      this.client
        .send(`hyundai/skidPlatformHistory/insert`, skidPlatformHistoryFormIf)
        .pipe(take(1))
        .subscribe();

      await this.settingRedis(`p${SkidPlatformId}`, inOutType);

      // redis에 입출고 내역을 저장하기 위함
      await this.queueRedis(SkidPlatformId.toString(), inOutType);
    } catch (e) {
      console.log(e);
    }
  }

  // redis를 편하게 쓰기 위해 쓰는 함수
  async settingRedis(key: string, value: string) {
    await this.redisService.set(key, value);
  }

  // redis에서 'in' 되면 queue에 넣고, 'out'되면 queue에서 빼는 메서드
  async queueRedis(asrsId: string, inOutType: string) {
    if (inOutType === 'in') {
      await this.redisService.push('skidplatform', asrsId);
    } else if (inOutType === 'out') {
      await this.redisService.removeElement('skidplatform', 0, asrsId);
    }
  }

  // redis list에 남아 있는 것중 가장 오래된 것 불출
  async createOutOrder() {
    const skidPlatformId = await this.redisService.pop('skidplatform');
    if (+skidPlatformId <= 0) {
      throw new HttpException('안착대에 화물이 없습니다.', 400);
    }
    // await this.sendOutOrder(+asrsId);
  }

  // barcode와 separateNumber로 target awb를 찾기 위한 함수
  async findAwbByBarcode(billNo: string, separateNumber: number) {
    try {
      const awbResult = await this.awbRepository.findOne({
        where: { barcode: billNo, separateNumber: separateNumber },
        order: orderByUtil(null),
      });
      return awbResult;
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * plc로 들어온 데이터중 화물 누락된 화물 데이터 체크
   */
  async checkAwb() {
    for (let unitNumber = 1; unitNumber <= 4; unitNumber++) {
      const unitKey = this.formatUnitNumber(unitNumber);

      const awbNo = `SUPPLY_01_${unitKey}_P2A_Bill_No`;
      const separateNumber = `SUPPLY_01_${unitKey}_P2A_SEPARATION_NO`;

      // this.awbService.createAwbByPlcMqttUsingAsrsAndSkidPlatform(
      //   awbNo,
      //   +separateNumber,
      // );
    }
  }
}
