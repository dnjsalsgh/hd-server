import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SimulatorResult } from './entities/simulator-result.entity';
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
import { CreateSimulatorResultDto } from './dto/create-simulator-result.dto';
import { UpdateSimulatorResultDto } from './dto/update-simulator-result.dto';
import { UldAttribute } from '../uld/entities/uld.entity';
import { CreateSimulatorResultWithAwbAndHistoryDto } from './dto/create-simulator-result-with-awb';
import { SimulatorResultAwbJoin } from '../simulator-result-awb-join/entities/simulator-result-awb-join.entity';
import { SimulatorHistory } from '../simulator-history/entities/simulator-history.entity';
import { CreateSimulatorHistoryDto } from '../simulator-history/dto/create-simulator-history.dto';
import { CreateSimulatorResultAwbJoinDto } from '../simulator-result-awb-join/dto/create-simulator-result-awb-join.dto';
import { BasicQueryParam } from '../lib/dto/basicQueryParam';
import { getOrderBy } from '../lib/util/getOrderBy';
import { AwbAttribute } from '../awb/entities/awb.entity';
import { CreateSimulatorResultOrderDto } from './dto/create-simulator-result-order.dto';
import { AsrsHistory } from '../asrs-history/entities/asrs-history.entity';
import { SkidPlatformHistory } from '../skid-platform-history/entities/skid-platform-history.entity';
import { AsrsOutOrder } from '../asrs-out-order/entities/asrs-out-order.entity';
import { BuildUpOrder } from '../build-up-order/entities/build-up-order.entity';
import { CreateAsrsOutOrderDto } from '../asrs-out-order/dto/create-asrs-out-order.dto';
import { CreateBuildUpOrderDto } from '../build-up-order/dto/create-build-up-order.dto';
import { ClientProxy } from '@nestjs/microservices';
import { take } from 'rxjs';
import { Asrs } from '../asrs/entities/asrs.entity';

@Injectable()
export class SimulatorResultService {
  constructor(
    @InjectRepository(SimulatorResult)
    private readonly simulatorResultRepository: Repository<SimulatorResult>,
    @InjectRepository(AsrsHistory)
    private readonly asrsHistoryRepository: Repository<AsrsHistory>,
    @InjectRepository(SkidPlatformHistory)
    private readonly skidPlatformHistoryRepository: Repository<SkidPlatformHistory>,
    @InjectRepository(AsrsOutOrder)
    private readonly asrsOutOrderRepository: Repository<AsrsOutOrder>,
    @InjectRepository(BuildUpOrder)
    private readonly buildUpOrderRepository: Repository<BuildUpOrder>,
    @Inject('MQTT_SERVICE') private client: ClientProxy,
    private dataSource: DataSource,
  ) {}

  async create(createSimulatorResultDto: CreateSimulatorResultDto) {
    const result = await this.simulatorResultRepository.save(
      createSimulatorResultDto,
    );
    return result;
  }

  async createWithAwb(body: CreateSimulatorResultWithAwbAndHistoryDto) {
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Awb의 정보 validation 체크
      if (
        !body.AwbWithXYZ.every(
          (obj) => 'Awb' in obj && 'x' in obj && 'y' in obj && 'z' in obj,
        )
      ) {
        throw new NotFoundException('Awb 상세 정보가 없습니다.');
      }

      // 1. simulatorResult 입력
      const simulatorResultResult = await queryRunner.manager
        .getRepository(SimulatorResult)
        .save(body);

      const joinParamArray: CreateSimulatorResultAwbJoinDto[] = [];
      const historyParamArray: CreateSimulatorHistoryDto[] = [];

      // 2. 입력되는 화물과 좌표를 이력에 입력
      for (let i = 0; i < body.AwbWithXYZ.length; i++) {
        // 2-1. Awb 이력 입력
        const joinParam: CreateSimulatorResultAwbJoinDto = {
          Awb: body.AwbWithXYZ[i].Awb,
          SimulatorResult: simulatorResultResult.id,
        };
        joinParamArray.push(joinParam);

        // 2-2. SimulatorHistory 입력
        const historyParam: CreateSimulatorHistoryDto = {
          Uld: body.Uld,
          Awb: body.AwbWithXYZ[i].Awb,
          SimulatorResult: simulatorResultResult.id,
          x: body.AwbWithXYZ[i].x,
          y: body.AwbWithXYZ[i].y,
          z: body.AwbWithXYZ[i].z,
        };
        historyParamArray.push(historyParam);
      }

      const joinResult = queryRunner.manager
        .getRepository(SimulatorResultAwbJoin)
        .save(joinParamArray);
      const historyResult = queryRunner.manager
        .getRepository(SimulatorHistory)
        .save(historyParamArray);

      // awbjoin 테이블, 이력 테이블 함께 저장
      await Promise.all([joinResult, historyResult]);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new TypeORMError(`rollback Working - ${error}`);
    } finally {
      await queryRunner.release();
    }
  }

  async createOrder(body: CreateSimulatorResultOrderDto) {
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // 자동창고의 최신 이력을 화물 기준으로 가져오기(패키지 시뮬레이터에 넘겨줄 것)
    const asrsHistorySubQueryBuilder = this.asrsHistoryRepository
      .createQueryBuilder('sub_asrsHistory')
      .select('awb_id, MAX(id) AS max_id')
      .groupBy('awb_id');
    const asrsHistoryResult = await this.asrsHistoryRepository
      .createQueryBuilder('asrsHistory')
      .leftJoinAndSelect('asrsHistory.Awb', 'Awb')
      .leftJoinAndSelect('asrsHistory.Asrs', 'Asrs')
      .where(
        `(asrsHistory.awb_id, asrsHistory.id) IN (${asrsHistorySubQueryBuilder.getQuery()})`,
      )
      .andWhere('asrsHistory.deleted_at IS NULL')
      .orderBy('asrsHistory.id', 'DESC')
      .getMany();

    // 안착대의 최신 이력을 화물 기준으로 가져오기(패키지 시뮬레이터에 넘겨줄 것)
    const skidPlatformHistorySubQueryBuilder =
      this.skidPlatformHistoryRepository
        .createQueryBuilder('sub_skidPlatformHistory')
        .select('skid_platform_id, MAX(id) AS max_id')
        .groupBy('skid_platform_id');
    const skidPlatformHistoryResult = await this.skidPlatformHistoryRepository
      .createQueryBuilder('skidPlatformHistory')
      .leftJoinAndSelect('skidPlatformHistory.Awb', 'Awb')
      .leftJoinAndSelect('skidPlatformHistory.Asrs', 'Asrs')
      .where(
        `(skidPlatformHistory.skid_platform_id, skidPlatformHistory.id) IN (${skidPlatformHistorySubQueryBuilder.getQuery()})`,
      )
      .andWhere('skidPlatformHistory.deleted_at IS NULL')
      .orderBy('skidPlatformHistory.id', 'DESC')
      .getMany();

    // TODO 패키지 시뮬레이터에 자동창고 정보, 안착대 정보, uld 정보를 같이 묶어서 api 호출하기
    // 호출하는 부분
    /*
     *
     *
     *
     * */

    // 패키시 시뮬레이터에서 자동창고 작업자시정보가 이렇게 온다고 가정한 테스트용 객체

    try {
      // 1. 자동창고 작업지시를 만들기
      const asrsOutOrderParamArray: CreateAsrsOutOrderDto[] = [];
      for (const [index, element] of body.outOrder.entries()) {
        const asrsOutOrderParam = {
          order: index,
          Asrs: element.Asrs,
          Awb: element.Awb,
          SkidPlatform: body.Uld,
        };
        asrsOutOrderParamArray.push(asrsOutOrderParam);
      }
      const asrsOutOrderResult = await queryRunner.manager
        .getRepository(AsrsOutOrder)
        .save(asrsOutOrderParamArray);

      // 2. 자동창고 작업지시 데이터 mqtt로 publish 하기 위함
      // 자동창고 작업지시가 생성되었을 때만 동작합니다.
      if (asrsOutOrderResult) {
        // 패키징 시뮬레이터에서 도출된 최적 불출순서 mqtt publish(자동창고 불출을 위함)
        this.client
          .send(`hyundai/asrs1/outOrder`, {
            asrsOurOrderResult: asrsOutOrderResult,
            time: new Date().toISOString(),
          })
          .pipe(take(1))
          .subscribe();

        // 최적 불출순서를 자동창고(ASRS) PLC에 write 완료했다는 신호
        this.client
          .send(`hyundai/asrs1/writeCompl`, {
            asrsOurOrderResult: asrsOutOrderResult,
            time: new Date().toISOString(),
          })
          .pipe(take(1))
          .subscribe();
      }

      // 패키시 시뮬레이터에서 작업자 작업자시정보가 이렇게 온다고 가정한 테스트용 객체

      // Awb의 정보 validation 체크
      if (
        !body.AwbWithXYZ.every(
          (obj) => 'Awb' in obj && 'x' in obj && 'y' in obj && 'z' in obj,
        )
      ) {
        throw new NotFoundException('Awb 상세 정보가 없습니다.');
      }

      // 1. simulatorResult 입력
      const simulatorResultResult = await queryRunner.manager
        .getRepository(SimulatorResult)
        .save(body);

      const joinParamArray: CreateSimulatorResultAwbJoinDto[] = [];
      const historyParamArray: CreateSimulatorHistoryDto[] = [];
      const buildUpOrderParamArray: CreateBuildUpOrderDto[] = [];

      // 2. 입력되는 화물과 좌표를 이력에 입력
      for (let i = 0; i < body.AwbWithXYZ.length; i++) {
        // 2-1. Awb 이력 입력
        const joinParam: CreateSimulatorResultAwbJoinDto = {
          Awb: body.AwbWithXYZ[i].Awb,
          SimulatorResult: simulatorResultResult.id,
        };
        joinParamArray.push(joinParam);

        // 2-2. SimulatorHistory 입력
        const historyParam: CreateSimulatorHistoryDto = {
          Uld: body.Uld,
          Awb: body.AwbWithXYZ[i].Awb,
          SimulatorResult: simulatorResultResult.id,
          x: body.AwbWithXYZ[i].x,
          y: body.AwbWithXYZ[i].y,
          z: body.AwbWithXYZ[i].z,
        };
        historyParamArray.push(historyParam);

        // 2-3. 작업자 작업지시를 만들기
        const buildUpOrderBody: CreateBuildUpOrderDto = {
          order: i,
          x: body.AwbWithXYZ[i].x,
          y: body.AwbWithXYZ[i].y,
          z: body.AwbWithXYZ[i].z,
          SkidPlatform: body.AwbWithXYZ[i].SkidPlatform,
          Uld: body.Uld,
          Awb: body.AwbWithXYZ[i].Awb,
        };
        buildUpOrderParamArray.push(buildUpOrderBody);
      }

      const joinResult = queryRunner.manager
        .getRepository(SimulatorResultAwbJoin)
        .save(joinParamArray);
      const historyResult = queryRunner.manager
        .getRepository(SimulatorHistory)
        .save(historyParamArray);
      const buildUpOrderResult = queryRunner.manager
        .getRepository(BuildUpOrder)
        .save(buildUpOrderParamArray);

      // awbjoin 테이블, 이력 테이블 함께 저장
      await Promise.all([joinResult, historyResult, buildUpOrderResult]);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new TypeORMError(`rollback Working - ${error}`);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(query: SimulatorResult & BasicQueryParam) {
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
    const simulatorResultResult = await this.simulatorResultRepository.find({
      relations: {
        Uld: true,
        Awb: true,
      },
      select: {
        Uld: UldAttribute,
        Awb: AwbAttribute,
      },
      where: {
        loadRate: query.loadRate,
        version: query.version,
        Uld: query.Uld ? Equal(+query.Uld) : undefined,
        createdAt: findDate,
      },
      order: getOrderBy(query.order),
      take: query.limit,
      skip: query.offset,
    });
    return simulatorResultResult;
  }

  async findOne(id: number) {
    return await this.simulatorResultRepository.find({
      where: { id: id },
      relations: {
        Uld: true,
        Awb: true,
      },
      select: {
        Uld: UldAttribute,
        Awb: AwbAttribute,
      },
    });
  }

  update(id: number, updateSimulatorResultDto: UpdateSimulatorResultDto) {
    return this.simulatorResultRepository.update(id, updateSimulatorResultDto);
  }

  remove(id: number) {
    return this.simulatorResultRepository.delete(id);
  }
}
