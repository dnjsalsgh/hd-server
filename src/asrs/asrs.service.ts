import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAsrsDto } from './dto/create-asrs.dto';
import { UpdateAsrsDto } from './dto/update-asrs.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Asrs } from './entities/asrs.entity';
import {
  Between,
  DataSource,
  FindOperator,
  ILike,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
  TypeORMError,
} from 'typeorm';
import { AsrsHistory } from '../asrs-history/entities/asrs-history.entity';
import { CreateAsrsPlcDto } from './dto/create-asrs-plc.dto';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { orderByUtil } from '../lib/util/orderBy.util';
import { Awb } from '../awb/entities/awb.entity';
import { RedisService } from '../redis/redis.service';
import { ClientProxy } from '@nestjs/microservices';
import { take } from 'rxjs';
import { AwbService } from '../awb/awb.service';

@Injectable()
export class AsrsService {
  constructor(
    @InjectRepository(Asrs)
    private readonly asrsRepository: Repository<Asrs>,
    @InjectRepository(AsrsHistory)
    private readonly asrsHistoryRepository: Repository<AsrsHistory>,
    @InjectRepository(Awb)
    private readonly awbRepository: Repository<Awb>,
    private dataSource: DataSource,
    private redisService: RedisService,
    private readonly awbService: AwbService,
    @Inject('MQTT_SERVICE') private client: ClientProxy,
  ) {}

  async create(createAsrsDto: CreateAsrsDto): Promise<Asrs> {
    let parentAsrs;
    let parentFullPath = '';

    // 부모 정보가 들어올 시
    if (createAsrsDto.parent > 0) {
      parentAsrs = await this.asrsRepository.findOne({
        where: {
          id: createAsrsDto.parent,
        },
      });

      // 부모정보가 없다면 throw
      if (!parentAsrs)
        throw new HttpException('asrs의 부모 정보가 없습니다.', 400);

      // 부모 level + 1
      createAsrsDto.level = parentAsrs.level + 1;

      parentFullPath = parentAsrs.fullPath;
    }

    // fullPath 설정 [부모fullPath] + [fullPath]
    createAsrsDto.fullPath = `${createAsrsDto.fullPath}-`;
    createAsrsDto.fullPath = parentFullPath + createAsrsDto.fullPath;

    const asrs = await this.asrsRepository.create(createAsrsDto);

    await this.asrsRepository.save(asrs);
    return asrs;
  }

  async findAll(query: Asrs & BasicQueryParamDto) {
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
    return await this.asrsRepository.find({
      where: {
        name: query.name ? ILike(`%${query.name}%`) : undefined,
        simulation: query.simulation,
        createdAt: findDate,
      },
      order: orderByUtil(query.order),
      take: query.limit,
      skip: query.offset,
    });
  }

  async findOne(id: number) {
    const result = await this.asrsRepository.findOne({ where: { id: id } });
    return result;
  }

  async update(id: number, updateAsrsDto: UpdateAsrsDto) {
    const myInfo = await this.asrsRepository.findOne({ where: { id: id } });
    const parentInfo = await this.asrsRepository.findOne({
      where: { id: updateAsrsDto.parent },
    });

    if (updateAsrsDto.parent && !parentInfo)
      throw new NotFoundException('asrs의 부모 정보가 없습니다.');

    if (!myInfo) throw new NotFoundException('asrs의 정보가 없습니다.');

    // 부모 찾기
    const asrsFamily = await this.asrsRepository.find({
      where: { fullPath: Like(`%${myInfo.fullPath}%`) },
    });

    // 각 패밀리들의 업데이트 정보 세팅하기
    const newFamilyList: UpdateAsrsDto[] = [];

    const newLevel = parentInfo ? parentInfo.level + 1 : 0;
    const parentId = parentInfo ? parentInfo.id : 0;
    const parentFullPath = parentInfo
      ? parentInfo.fullPath
      : updateAsrsDto.fullPath || '';

    // 부모의 fullPath 조회 함수
    const getParentFullPath = (parent: number): string => {
      const foundElement = newFamilyList.find((element) => {
        if (element && element.id) return element.id === parent;
      });
      return foundElement ? foundElement.fullPath || '' : '';
    };

    // 나와 패밀리의 새로운 정보 세팅
    for (let i = 0; i < asrsFamily.length; i += 1) {
      // (주의!)나의 정보인경우(familyList[i].id === myInfo.id)의 세팅값과 (나를 제외한)패밀리의 세팅값이 다르다.
      const parent =
        asrsFamily[i].id === myInfo.id ? parentId : asrsFamily[i].parent;
      const level =
        asrsFamily[i].id === myInfo.id
          ? newLevel
          : asrsFamily[i].level + (newLevel - myInfo.level);
      const parentPath =
        asrsFamily[i].id === myInfo.id
          ? parentFullPath
          : getParentFullPath(asrsFamily[i].parent);
      const name =
        asrsFamily[i].id === myInfo.id
          ? updateAsrsDto.name
          : asrsFamily[i].name;
      const myPath = `${name || asrsFamily[i].name}-`;
      const fullPath = (parentPath || '') + myPath;
      const orderby =
        asrsFamily[i].id === myInfo.id
          ? updateAsrsDto.orderby
          : asrsFamily[i].orderby;

      newFamilyList.push({
        id: asrsFamily[i].id,
        name: name,
        parent: parent,
        level: level,
        fullPath: fullPath,
        orderby: orderby,
      });
    }

    return this.asrsRepository.save(newFamilyList);
  }

  remove(id: number) {
    return this.asrsRepository.delete(id);
  }

  /**
   * plc로 들어온 데이터를 창고에 입력 데이터로 입력 후 이력 등록
   * awb와 asrs의 정보를 처리해야함
   * @param body
   */
  async checkAsrsChange(body: CreateAsrsPlcDto) {
    for (let unitNumber = 1; unitNumber <= 18; unitNumber++) {
      const unitKey = this.formatUnitNumber(unitNumber);
      const previousState = await this.redisService.get(unitNumber.toString());

      const onOffTag = this.getTag('SKID_ON', unitKey);
      const onOffSignal = this.checkOnOff(body, onOffTag);
      const awbNo = this.getTag('Bill_No', unitKey);
      const separateNumber = this.getTag('SEPARATION_NO', unitKey);
      const variableInOut = onOffSignal ? 'in' : 'out';

      // 빈 바코드 있을 때 다음걸로 넘어가기
      if (body[awbNo] === '') {
        continue;
      }

      if (this.shouldSetInOUtAsrs(onOffSignal, previousState)) {
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
  checkOnOff(body: CreateAsrsPlcDto, onOffTag: string) {
    return body[onOffTag];
  }

  // key 값을 return 하는 함수
  getTag(suffix: string, unitKey: string) {
    return `STK_03_${unitKey}_P2A_${suffix}`;
  }

  // in인지 out 인지 return 하는 함수
  shouldSetInOUtAsrs(
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

      await this.recordOperation(unitNumber, awb?.id, inOutType);
      // await this.settingRedis(String(unitNumber), state);
    } catch (error) {
      console.error(error.message);
    }
  }

  // 실제로 asrsHistory db에 저장하는 메서드
  async recordOperation(
    asrsId: number,
    awbId: number,
    inOutType: 'in' | 'out',
  ) {
    try {
      const asrsHistoryBody = {
        inOutType,
        count: 0,
        Asrs: asrsId,
        Awb: awbId,
      };

      const asrsHistoryFromIf = await this.asrsHistoryRepository.save(
        asrsHistoryBody,
      );

      // asrsHistory에 입력이 성공 했다면
      if (asrsHistoryFromIf) {
        await this.awbRepository.update(awbId, { state: 'inasrs' });
      }

      // asrsHistory를 mqtt에 보내기 위함
      this.client
        .send(`hyundai/asrsHistory/insert`, asrsHistoryFromIf)
        .pipe(take(1))
        .subscribe();

      await this.settingRedis(asrsId.toString(), inOutType);

      // redis에 입출고 내역을 저장하기 위함
      await this.queueRedis(asrsId.toString(), inOutType);
    } catch (error) {
      console.log(error);
    }
  }

  // redis를 편하게 쓰기 위해 쓰는 함수
  async settingRedis(key: string, value: string) {
    await this.redisService.set(key, value);
  }

  // redis에서 'in' 되면 queue에 넣고, 'out'되면 queue에서 빼는 메서드
  async queueRedis(asrsId: string, inOutType: string) {
    if (inOutType === 'in') {
      await this.redisService.push('asrs', asrsId);
    } else if (inOutType === 'out') {
      await this.redisService.removeElement('asrs', 0, asrsId);
    }
  }

  // redis list에 남아 있는 것중 가장 오래된 것 불출
  async createOutOrder() {
    const asrsId = await this.redisService.pop('asrs');
    if (+asrsId <= 0) {
      throw new HttpException('창고에 화물이 없습니다.', 400);
    }
    await this.sendOutOrder(+asrsId);
  }

  // 불출 서열을 mqtt에 publish 하기 위한 메서드
  async sendOutOrder(asrsId: number) {
    this.client
      .send(`hyundai/asrs1/outOrder`, [{ order: 0, asrs: asrsId }])
      .pipe(take(1))
      .subscribe();
  }

  async findAsrsByName(name: string) {
    return await this.asrsRepository.findOne({
      where: { name: name },
      order: orderByUtil(null),
    });
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
   * @param body
   */
  async checkAwb(body: CreateAsrsPlcDto) {
    // asrs의 정보들
    for (let unitNumber = 1; unitNumber <= 18; unitNumber++) {
      const unitKey = this.formatUnitNumber(unitNumber);

      const awbNo = this.getTag('Bill_No', unitKey);
      const separateNumber = this.getTag('SEPARATION_NO', unitKey);

      const awb = await this.findAwbByBarcode(
        body[awbNo],
        +body[separateNumber],
      );

      if (awb) {
        continue;
      }
      await this.awbService.createAwbByPlcMqttUsingAsrsAndSkidPlatform(
        body[awbNo],
        +body[separateNumber],
      );
    }

    // skidPlatformHistory의 정보들
    for (let unitNumber = 1; unitNumber <= 4; unitNumber++) {
      const unitKey = this.formatUnitNumber(unitNumber);

      const awbNo = `SUPPLY_01_${unitKey}_P2A_Bill_No`;
      const separateNumber = `SUPPLY_01_${unitKey}_P2A_SEPARATION_NO`;

      const awb = await this.findAwbByBarcode(
        body[awbNo],
        +body[separateNumber],
      );

      if (awb) {
        continue;
      }

      await this.awbService.createAwbByPlcMqttUsingAsrsAndSkidPlatform(
        body[awbNo],
        +body[separateNumber],
      );
    }
  }
}
