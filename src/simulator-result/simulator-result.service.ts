import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SimulatorResult } from './entities/simulator-result.entity';
import {
  Between,
  DataSource,
  Equal,
  FindOperator,
  ILike,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
  TypeORMError,
} from 'typeorm';
import { CreateSimulatorResultDto } from './dto/create-simulator-result.dto';
import { UpdateSimulatorResultDto } from './dto/update-simulator-result.dto';
import { Uld, UldAttribute } from '../uld/entities/uld.entity';
import { CreateSimulatorResultWithAwbAndHistoryDto } from './dto/create-simulator-result-with-awb';
import { SimulatorResultAwbJoin } from '../simulator-result-awb-join/entities/simulator-result-awb-join.entity';
import { SimulatorHistory } from '../simulator-history/entities/simulator-history.entity';
import { CreateSimulatorHistoryDto } from '../simulator-history/dto/create-simulator-history.dto';
import { CreateSimulatorResultAwbJoinDto } from '../simulator-result-awb-join/dto/create-simulator-result-awb-join.dto';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { orderByUtil } from '../lib/util/orderBy.util';
import { Awb, AwbAttribute } from '../awb/entities/awb.entity';
import { CreateSimulatorResultOrderDto } from './dto/create-simulator-result-order.dto';
import { AsrsHistory } from '../asrs-history/entities/asrs-history.entity';
import { SkidPlatformHistory } from '../skid-platform-history/entities/skid-platform-history.entity';
import { AsrsOutOrder } from '../asrs-out-order/entities/asrs-out-order.entity';
import { BuildUpOrder } from '../build-up-order/entities/build-up-order.entity';
import { CreateAsrsOutOrderDto } from '../asrs-out-order/dto/create-asrs-out-order.dto';
import { CreateBuildUpOrderDto } from '../build-up-order/dto/create-build-up-order.dto';
import { ClientProxy } from '@nestjs/microservices';
import { take } from 'rxjs';
import { BuildUpOrderService } from '../build-up-order/build-up-order.service';
import { pakageSimulatorCallResultData } from '../lib/util/pakageSimulatorCallResultData.json';

import { PsApiRequest } from './dto/ps-input.dto';
import { Asrs } from '../asrs/entities/asrs.entity';
import {
  UldType,
  UldTypeAttribute,
} from '../uld-type/entities/uld-type.entity';
import { getOrderDischarge, getUserSelect } from '../lib/util/axios.util';
import { CreateAsrsHistoryDto } from '../asrs-history/dto/create-asrs-history.dto';
import { AsrsHistoryService } from '../asrs-history/asrs-history.service';
import { SkidPlatformHistoryService } from '../skid-platform-history/skid-platform-history.service';
import { userSelectInput } from './dto/user-select-input.dto';
import { SkidPlatform } from '../skid-platform/entities/skid-platform.entity';
import { UldHistoryService } from '../uld-history/uld-history.service';

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
    private readonly buildUpOrderService: BuildUpOrderService,
    @InjectRepository(Uld)
    private readonly uldRepository: Repository<Uld>,
    private readonly asrsHistoryService: AsrsHistoryService,
    private readonly skidPlatformHistoryService: SkidPlatformHistoryService,
    private readonly uldHistoryService: UldHistoryService,
  ) {}

  async create(createSimulatorResultDto: CreateSimulatorResultDto) {
    const result = await this.simulatorResultRepository.save(
      createSimulatorResultDto,
    );
    return result;
  }

  // 초기버전
  // async createOrder(body: CreateSimulatorResultOrderDto) {
  //   const queryRunner = await this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();
  //
  //   // 자동창고의 최신 이력을 화물 기준으로 가져오기(패키지 시뮬레이터에 넘겨줄 것)
  //   const asrsHistorySubQueryBuilder = this.asrsHistoryRepository
  //     .createQueryBuilder('sub_asrsHistory')
  //     .select('awb_id, MAX(id) AS max_id')
  //     .groupBy('awb_id');
  //   const asrsHistoryResult = await this.asrsHistoryRepository
  //     .createQueryBuilder('asrsHistory')
  //     .leftJoinAndSelect('asrsHistory.Awb', 'Awb')
  //     .leftJoinAndSelect('asrsHistory.Asrs', 'Asrs')
  //     .where(
  //       `(asrsHistory.awb_id, asrsHistory.id) IN (${asrsHistorySubQueryBuilder.getQuery()})`,
  //     )
  //     .andWhere('asrsHistory.deleted_at IS NULL')
  //     .orderBy('asrsHistory.id', 'DESC')
  //     .getMany();
  //
  //   // 안착대의 최신 이력을 화물 기준으로 가져오기(패키지 시뮬레이터에 넘겨줄 것)
  //   const skidPlatformHistorySubQueryBuilder =
  //     this.skidPlatformHistoryRepository
  //       .createQueryBuilder('sub_skidPlatformHistory')
  //       .select('skid_platform_id, MAX(id) AS max_id')
  //       .groupBy('skid_platform_id');
  //   const skidPlatformHistoryResult = await this.skidPlatformHistoryRepository
  //     .createQueryBuilder('skidPlatformHistory')
  //     .leftJoinAndSelect('skidPlatformHistory.Awb', 'Awb')
  //     .leftJoinAndSelect('skidPlatformHistory.Asrs', 'Asrs')
  //     .where(
  //       `(skidPlatformHistory.skid_platform_id, skidPlatformHistory.id) IN (${skidPlatformHistorySubQueryBuilder.getQuery()})`,
  //     )
  //     .andWhere('skidPlatformHistory.deleted_at IS NULL')
  //     .orderBy('skidPlatformHistory.id', 'DESC')
  //     .getMany();
  //
  //   // TODO 패키지 시뮬레이터에 자동창고 정보, 안착대 정보, uld 정보를 같이 묶어서 api 호출하기
  //   // TODO 나중에 패키지 시뮬레이터에 값을 주고 받는 데이터 format을 맞춰야 함
  //   // 호출하는 부분
  //   /*
  //    *
  //    *
  //    *
  //    * */
  //   // 패키시 시뮬레이터에서 자동창고 작업자시정보가 이렇게 온다고 가정한 테스트용 객체
  //
  //   try {
  //     // 1. 자동창고 작업지시를 만들기
  //     const asrsOutOrderParamArray: CreateAsrsOutOrderDto[] = [];
  //     for (const [index, element] of body.outOrder.entries()) {
  //       const asrsOutOrderParam = {
  //         order: index,
  //         Asrs: element.Asrs,
  //         Awb: element.Awb,
  //         SkidPlatform: body.Uld,
  //       };
  //       asrsOutOrderParamArray.push(asrsOutOrderParam);
  //     }
  //     const asrsOutOrderResult = await queryRunner.manager
  //       .getRepository(AsrsOutOrder)
  //       .save(asrsOutOrderParamArray);
  //
  //     // 1-1. 자동창고 작업지시 데이터 mqtt로 publish 하기
  //     // 자동창고 작업지시가 생성되었을 때만 동작합니다.
  //     if (asrsOutOrderResult) {
  //       // 1-2. 패키징 시뮬레이터에서 도출된 최적 불출순서 mqtt publish(자동창고 불출을 위함)
  //       this.client
  //         .send(`hyundai/asrs1/outOrder`, {
  //           asrsOurOrderResult: asrsOutOrderResult,
  //           time: new Date().toISOString(),
  //         })
  //         .pipe(take(1))
  //         .subscribe();
  //
  //       // 1-3. 최적 불출순서를 자동창고(ASRS) PLC에 write 완료했다는 신호
  //       this.client
  //         .send(`hyundai/asrs1/writeCompl`, {
  //           asrsOurOrderResult: asrsOutOrderResult,
  //           time: new Date().toISOString(),
  //         })
  //         .pipe(take(1))
  //         .subscribe();
  //     }
  //
  //     // 패키시 시뮬레이터에서 작업자 작업자시(build-up-order)정보가 이렇게 온다고 가정한 테스트용 객체
  //     // 2. 작업자 작업지시 만들기
  //     // 2-1. Awb의 정보 validation 체크
  //     if (
  //       !body.AwbWithXYZ.every(
  //         (obj) => 'Awb' in obj && 'x' in obj && 'y' in obj && 'z' in obj,
  //       )
  //     ) {
  //       throw new NotFoundException('Awb 상세 정보가 없습니다.');
  //     }
  //
  //     // 2-2. simulatorResult 입력
  //     const simulatorResultResult = await queryRunner.manager
  //       .getRepository(SimulatorResult)
  //       .save(body);
  //
  //     const joinParamArray: CreateSimulatorResultAwbJoinDto[] = [];
  //     const historyParamArray: CreateSimulatorHistoryDto[] = [];
  //     const buildUpOrderParamArray: CreateBuildUpOrderDto[] = [];
  //
  //     // 2-3. 입력되는 화물과 좌표를 이력에 입력
  //     for (let i = 0; i < body.AwbWithXYZ.length; i++) {
  //       // 2-1. 어떤 Awb를 썼는지 등록
  //       const joinParam: CreateSimulatorResultAwbJoinDto = {
  //         Awb: body.AwbWithXYZ[i].Awb,
  //         SimulatorResult: simulatorResultResult.id,
  //       };
  //       joinParamArray.push(joinParam);
  //
  //       // 2-2. 어떤 Uld, 각각의 화물의 좌표 값, 시뮬레이터를 썼는지 이력저장
  //       const historyParam: CreateSimulatorHistoryDto = {
  //         Uld: body.Uld,
  //         Awb: body.AwbWithXYZ[i].Awb,
  //         SimulatorResult: simulatorResultResult.id,
  //         x: body.AwbWithXYZ[i].x,
  //         y: body.AwbWithXYZ[i].y,
  //         z: body.AwbWithXYZ[i].z,
  //       };
  //       historyParamArray.push(historyParam);
  //
  //       // 2-3. 작업자 작업지시를 만들기
  //       const buildUpOrderBody: CreateBuildUpOrderDto = {
  //         order: i,
  //         x: body.AwbWithXYZ[i].x,
  //         y: body.AwbWithXYZ[i].y,
  //         z: body.AwbWithXYZ[i].z,
  //         SkidPlatform: body.AwbWithXYZ[i].SkidPlatform,
  //         Uld: body.Uld,
  //         Awb: body.AwbWithXYZ[i].Awb,
  //       };
  //       buildUpOrderParamArray.push(buildUpOrderBody);
  //     }
  //
  //     const joinResult = queryRunner.manager
  //       .getRepository(SimulatorResultAwbJoin)
  //       .save(joinParamArray);
  //     const historyResult = queryRunner.manager
  //       .getRepository(SimulatorHistory)
  //       .save(historyParamArray);
  //     const buildUpOrderResult = this.buildUpOrderService.createList(
  //       buildUpOrderParamArray,
  //       queryRunner,
  //     );
  //     // const buildUpOrderResult = queryRunner.manager
  //     //   .getRepository(BuildUpOrder)
  //     //   .save(buildUpOrderParamArray);
  //
  //     // 3. awbjoin 테이블, 이력 테이블 함께 저장
  //     await Promise.all([joinResult, historyResult, buildUpOrderResult]); // 실제로 쿼리 날아가는곳
  //
  //     await queryRunner.commitTransaction();
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //     throw new TypeORMError(`rollback Working - ${error}`);
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  // 패키지 시뮬레이터와 소통 후 자동창고 불출, 빌드업 작업지시 동시에 만드는 버전
  async createOrderByResult(apiRequest: PsApiRequest) {
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const mode = apiRequest.simulation; // 시뮬레이션, 커넥티드 분기

    // 자동창고 최신 이력을 화물 기준으로 가져오기(패키지 시뮬레이터에 넘겨줄 것
    const asrsStateArray = await this.asrsHistoryService.nowState();
    // 안착대의 최신 이력을 화물 기준으로 가져오기(패키지 시뮬레이터에 넘겨줄 것)
    const skidPlatformStateArray =
      await this.skidPlatformHistoryService.nowState();

    // ps에 현재 자동창고, 안착대 상태 보내기 로직 start
    // ps에 보낼 Awb 정보들 모아두는 배열
    const Awbs = [];
    for (const asrsHistory of asrsStateArray) {
      const AwbInfo = asrsHistory.Awb as Awb;
      const AsrsInfo = asrsHistory.Asrs as Asrs;
      const targetAwb = {
        id: AwbInfo.id,
        storageId: AsrsInfo.id,
        name: AwbInfo.name,
        width: AwbInfo.width,
        length: AwbInfo.length,
        depth: AwbInfo.depth,
        waterVolume: AwbInfo.waterVolume,
        weight: AwbInfo.weight,
        color: 'yellow',
        SCCs: AwbInfo.Scc?.map((v) => v.code),
        iceWeight: 0,
      };
      Awbs.push(targetAwb);
    }

    // ps에 보낼 Uld정보를 모아두는
    const Ulds = [];
    const uldResult = await this.uldRepository.findOne({
      select: {
        UldType: UldTypeAttribute,
      },
      relations: {
        UldType: true,
      },
      where: {
        code: apiRequest.UldCode ? ILike(`%${apiRequest.UldCode}%`) : undefined,
      },
    });
    // Uld주입하기
    if (uldResult) {
      const { id, code, UldType } = uldResult;
      const { width, length, depth, vertexCord } = UldType as UldType;
      Ulds.push({
        id,
        code,
        width,
        length,
        depth,
        // maxWeight: uldTypeResult.maxWeight,준규님이랑 최대 문개 어떻게 넣을지 논의하기
        uldType: typeof UldType === 'object' ? UldType.code : null,
        maxWeight: 10000,
        vertexCord,
      });
    }

    const packageSimulatorCallRequestObject = {
      mode: false,
      Awbs: Awbs,
      Ulds: Ulds,
    };
    const psResult = await getOrderDischarge(packageSimulatorCallRequestObject);
    // ps에 현재 자동창고, 안착대 상태 보내기 로직 end

    try {
      const bodyResult = psResult.result[0];
      // 1. 자동창고 작업지시를 만들기
      const asrsOutOrderParamArray: CreateAsrsOutOrderDto[] = [];
      for (const [index, element] of bodyResult.AWBInfoList.entries()) {
        const asrsOutOrderParam: CreateAsrsOutOrderDto = {
          order: index,
          Asrs: element.storageId,
          Awb: element.AwbId,
        };
        asrsOutOrderParamArray.push(asrsOutOrderParam);
      }
      const asrsOutOrderResult = await queryRunner.manager
        .getRepository(AsrsOutOrder)
        .upsert(asrsOutOrderParamArray, ['Asrs', 'Awb']);

      // 1-1. 자동창고 작업지시 데이터 mqtt로 publish 하기
      // 자동창고 작업지시가 생성되었을 때만 동작합니다.
      if (asrsOutOrderResult) {
        // 자동창고 작업지시를 객체형태로 mqtt에 publish하기 위한 find 과정
        const asrsResult = await queryRunner.manager
          .getRepository(AsrsOutOrder)
          .find({
            relations: {
              Asrs: true,
              Awb: true,
            },
            select: {
              Asrs: { id: true },
              Awb: { id: true },
            },
            where: {
              id: In(asrsOutOrderResult.identifiers.map((v) => v.id)),
            },
            order: { order: 'asc' },
          });

        // 불출순서를 mqtt에 배열로 보내기위해 전처리 과정
        const asrsOutOrder = asrsResult.map((asrsOutOrderElement) => {
          const Awb = asrsOutOrderElement.Awb as Awb;
          const Asrs = asrsOutOrderElement.Asrs as Asrs;
          return {
            order: asrsOutOrderElement.order,
            asrs: Asrs.id,
            awb: Awb.id,
          };
        });

        // asrs의 출고이력을 저장하기 위함
        const releaseAwb = asrsOutOrder[0];
        const asrsHistoryBody: CreateAsrsHistoryDto = {
          Asrs: releaseAwb.asrs,
          Awb: releaseAwb.awb,
          inOutType: 'out',
          count: 1,
        };
        await queryRunner.manager
          .getRepository(AsrsHistory)
          .save(asrsHistoryBody);

        /**
         * 시뮬레이션 결과,이력을 저장하기 위한 부분 start
         */

        const simulatorResultBody: CreateSimulatorResultDto = {
          startDate: new Date(),
          endDate: new Date(),
          loadRate: +bodyResult.squareVolumeRatio, // 적재율
          version: bodyResult.version,
          simulation: mode, // [시뮬레이션, 커넥티드 분기]
          Uld: bodyResult.UldId,
        };
        const simulatorResultResult = await queryRunner.manager
          .getRepository(SimulatorResult)
          .save(simulatorResultBody);

        const joinParamArray: CreateSimulatorResultAwbJoinDto[] = [];
        const historyParamArray: CreateSimulatorHistoryDto[] = [];

        // 2-3. 입력되는 화물과 좌표를 이력에 입력
        for (let i = 0; i < bodyResult.AWBInfoList.length; i++) {
          const coordinate = bodyResult.AWBInfoList[i].coordinate;
          // 2-1. 어떤 Awb를 썼는지 등록
          const joinParam: CreateSimulatorResultAwbJoinDto = {
            Awb: bodyResult.AWBInfoList[i].AwbId, // awbId연결
            SimulatorResult: simulatorResultResult.id,
          };
          joinParamArray.push(joinParam);

          for (let j = 1; j <= coordinate.length; j++) {
            // 2-2. 어떤 Uld, 각각의 화물의 좌표 값, 시뮬레이터를 썼는지 이력저장
            const historyParam: CreateSimulatorHistoryDto = {
              Uld: bodyResult.UldId,
              Awb: bodyResult.AWBInfoList[i].AwbId,
              SimulatorResult: simulatorResultResult.id,
              simulation: mode,
              x: +bodyResult.AWBInfoList[i].coordinate[j - 1][`p${j}x`],
              y: +bodyResult.AWBInfoList[i].coordinate[j - 1][`p${j}y`],
              z: +bodyResult.AWBInfoList[i].coordinate[j - 1][`p${j}z`],
            };
            historyParamArray.push(historyParam);
          }
        }

        const joinResult = queryRunner.manager
          .getRepository(SimulatorResultAwbJoin)
          .save(joinParamArray);
        const historyResult = queryRunner.manager
          .getRepository(SimulatorHistory)
          .save(historyParamArray);
        await Promise.all([joinResult, historyResult]); // 실제로 쿼리 날아가는곳

        /**
         * 시뮬레이션 결과,이력을 저장하기 위한 부분 end
         */

        // 1-2. 패키징 시뮬레이터에서 도출된 최적 불출순서 mqtt publish(자동창고 불출을 위함)
        this.client.send(`hyundai/asrs1/outOrder`, asrsOutOrder).subscribe();

        // 1-3. 최적 불출순서를 자동창고(ASRS) PLC에 write 완료했다는 신호
        this.client
          .send(`hyundai/asrs1/writeCompl`, { writeOrder: true })
          .pipe(take(1))
          .subscribe();
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new TypeORMError(`rollback Working - ${error}`);
    } finally {
      await queryRunner.release();
    }
  }

  // 패키지 시뮬레이터와 소통 후 [자동창고 불출] 만드는 곳
  async createAsrsOutOrderBySimulatorResult(apiRequest: PsApiRequest) {
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const mode = apiRequest.simulation; // 시뮬레이션, 커넥티드 분기

    // 자동창고의 최신 이력을 화물 기준으로 가져오기(패키지 시뮬레이터에 넘겨줄 것)
    const asrsStateArray = await this.asrsHistoryService.nowState();

    // ps에 현재 자동창고, 안착대 상태 보내기 로직 start
    // ps에 보낼 Awb 정보들 모아두는 배열
    const Awbs = [];
    for (const asrsHistory of asrsStateArray) {
      const AwbInfo = asrsHistory.Awb as Awb;
      const AsrsInfo = asrsHistory.Asrs as Asrs;
      const targetAwb = {
        id: AwbInfo.id,
        storageId: AsrsInfo.id,
        name: AwbInfo.name,
        width: AwbInfo.width,
        length: AwbInfo.length,
        depth: AwbInfo.depth,
        waterVolume: AwbInfo.waterVolume,
        weight: AwbInfo.weight,
        color: 'yellow',
        SCCs: AwbInfo.Scc?.map((v) => v.code),
        iceWeight: 0,
      };
      Awbs.push(targetAwb);
    }

    // ps에 보낼 Uld정보를 모아두는
    const Ulds = [];
    const uldResult = await this.uldRepository.findOne({
      select: {
        UldType: UldTypeAttribute,
      },
      relations: {
        UldType: true,
      },
      where: {
        code: apiRequest.UldCode ? ILike(`%${apiRequest.UldCode}%`) : undefined,
      },
    });
    // Uld주입하기
    if (uldResult) {
      const { id, code, UldType } = uldResult;
      const { width, length, depth, vertexCord } = UldType as UldType;
      Ulds.push({
        id,
        code,
        width,
        length,
        depth,
        // maxWeight: uldTypeResult.maxWeight,준규님이랑 최대 문개 어떻게 넣을지 논의하기
        uldType: typeof UldType === 'object' ? UldType.code : null,
        maxWeight: 10000,
        vertexCord,
      });
    }

    const packageSimulatorCallRequestObject = {
      mode: false,
      Awbs: Awbs,
      Ulds: Ulds,
    };

    const psResult = await getOrderDischarge(packageSimulatorCallRequestObject);
    // ps에 현재 자동창고, 안착대 상태 보내기 로직 end

    try {
      const bodyResult = psResult.result[0];
      // 1. 자동창고 작업지시를 만들기
      const asrsOutOrderParamArray: CreateAsrsOutOrderDto[] = [];
      for (const [index, element] of bodyResult.AWBInfoList.entries()) {
        const asrsOutOrderParam: CreateAsrsOutOrderDto = {
          order: index,
          Asrs: element.storageId,
          Awb: element.AwbId,
        };
        asrsOutOrderParamArray.push(asrsOutOrderParam);
      }
      const asrsOutOrderResult = await queryRunner.manager
        .getRepository(AsrsOutOrder)
        .upsert(asrsOutOrderParamArray, ['Asrs', 'Awb']);

      // 1-1. 자동창고 작업지시 데이터 mqtt로 publish 하기
      // 자동창고 작업지시가 생성되었을 때만 동작합니다.
      if (asrsOutOrderResult) {
        // 자동창고 작업지시를 객체형태로 mqtt에 publish하기 위한 find 과정
        const asrsResult = await queryRunner.manager
          .getRepository(AsrsOutOrder)
          .find({
            relations: {
              Asrs: true,
              Awb: true,
            },
            select: {
              Asrs: { id: true },
              Awb: { id: true },
            },
            where: {
              id: In(asrsOutOrderResult.identifiers.map((v) => v.id)),
            },
            order: { order: 'asc' },
          });

        // 불출순서를 mqtt에 배열로 보내기위해 전처리 과정
        const asrsOutOrder = asrsResult.map((asrsOutOrderElement) => {
          const Awb = asrsOutOrderElement.Awb as Awb;
          const Asrs = asrsOutOrderElement.Asrs as Asrs;
          return {
            order: asrsOutOrderElement.order,
            asrs: Asrs.id,
            awb: Awb.id,
          };
        });

        // asrs의 출고이력을 저장하기 위함
        const releaseAwb = asrsOutOrder[0];
        const asrsHistoryBody: CreateAsrsHistoryDto = {
          Asrs: releaseAwb.asrs,
          Awb: releaseAwb.awb,
          inOutType: 'out',
          count: 1,
        };
        await queryRunner.manager
          .getRepository(AsrsHistory)
          .save(asrsHistoryBody);

        /**
         * 시뮬레이션 결과,이력을 저장하기 위한 부분 start
         */

        const simulatorResultBody: CreateSimulatorResultDto = {
          startDate: new Date(),
          endDate: new Date(),
          loadRate: +bodyResult.squareVolumeRatio, // 적재율
          version: bodyResult.version,
          simulation: mode, // [시뮬레이션, 커넥티드 분기]
          Uld: bodyResult.UldId,
        };
        const simulatorResultResult = await queryRunner.manager
          .getRepository(SimulatorResult)
          .save(simulatorResultBody);

        const joinParamArray: CreateSimulatorResultAwbJoinDto[] = [];
        const historyParamArray: CreateSimulatorHistoryDto[] = [];

        // 2-3. 입력되는 화물과 좌표를 이력에 입력
        for (let i = 0; i < bodyResult.AWBInfoList.length; i++) {
          const coordinate = bodyResult.AWBInfoList[i].coordinate;
          // 2-1. 어떤 Awb를 썼는지 등록
          const joinParam: CreateSimulatorResultAwbJoinDto = {
            Awb: bodyResult.AWBInfoList[i].AwbId, // awbId연결
            SimulatorResult: simulatorResultResult.id,
          };
          joinParamArray.push(joinParam);

          for (let j = 1; j <= coordinate.length; j++) {
            // 2-2. 어떤 Uld, 각각의 화물의 좌표 값, 시뮬레이터를 썼는지 이력저장
            const historyParam: CreateSimulatorHistoryDto = {
              Uld: bodyResult.UldId,
              Awb: bodyResult.AWBInfoList[i].AwbId,
              SimulatorResult: simulatorResultResult.id,
              simulation: mode,
              x: +bodyResult.AWBInfoList[i].coordinate[j - 1][`p${j}x`],
              y: +bodyResult.AWBInfoList[i].coordinate[j - 1][`p${j}y`],
              z: +bodyResult.AWBInfoList[i].coordinate[j - 1][`p${j}z`],
            };
            historyParamArray.push(historyParam);
          }
        }

        const joinResult = queryRunner.manager
          .getRepository(SimulatorResultAwbJoin)
          .save(joinParamArray);
        const historyResult = queryRunner.manager
          .getRepository(SimulatorHistory)
          .save(historyParamArray);

        // 3. awbjoin 테이블, 이력 테이블 함께 저장
        await Promise.all([joinResult, historyResult]); // 실제로 쿼리 날아가는곳
        /**
         * 시뮬레이션 결과,이력을 저장하기 위한 부분 end
         */

        // 1-2. 패키징 시뮬레이터에서 도출된 최적 불출순서 mqtt publish(자동창고 불출을 위함)
        this.client.send(`hyundai/asrs1/outOrder`, asrsOutOrder).subscribe();

        // 1-3. 최적 불출순서를 자동창고(ASRS) PLC에 write 완료했다는 신호
        this.client
          .send(`hyundai/asrs1/writeCompl`, { writeOrder: true })
          .pipe(take(1))
          .subscribe();
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new TypeORMError(`rollback Working - ${error}`);
    } finally {
      await queryRunner.release();
    }
  }

  // 패키지 시뮬레이터의 결과로 [빌드업 작업지시]만 만드는 곳
  async createBuildUpOrderBySimulatorResult(apiRequest: userSelectInput) {
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const mode = apiRequest.simulation; // 시뮬레이션, 커넥티드 분기

    // 자동창고 최신 이력을 화물 기준으로 가져오기(패키지 시뮬레이터에 넘겨줄 것
    const asrsStateArray = await this.asrsHistoryService.nowState();
    // 안착대의 최신 이력을 화물 기준으로 가져오기(패키지 시뮬레이터에 넘겨줄 것)
    const skidPlatformStateArray =
      await this.skidPlatformHistoryService.nowState();
    // uld의 최신 이력을 uldCode 기준으로 가져오기(패키지 시뮬레이터에 넘겨줄 것)
    const uldStateArray = await this.uldHistoryService.nowState(
      apiRequest.UldCode,
    );

    // ps에 현재 자동창고, 안착대 상태 보내기 로직 start
    // 현재 ASRS의 정보들
    const Awbs = [];
    for (const asrsHistory of asrsStateArray) {
      const AwbInfo = asrsHistory.Awb as Awb;
      const AsrsInfo = asrsHistory.Asrs as Asrs;
      const targetAwb = {
        id: AwbInfo.id,
        storageId: AsrsInfo.id,
        name: AwbInfo.name,
        width: AwbInfo.width,
        length: AwbInfo.length,
        depth: AwbInfo.depth,
        waterVolume: AwbInfo.waterVolume,
        weight: AwbInfo.weight,
        SCCs: AwbInfo.Scc?.map((v) => v.code),
      };
      Awbs.push(targetAwb);
    }

    // ps에 보낼 Uld정보를 모아두는
    const Ulds = [];
    const uldResult = await this.uldRepository.findOne({
      select: {
        UldType: UldTypeAttribute,
      },
      relations: {
        UldType: true,
      },
      where: {
        code: apiRequest.UldCode,
      },
    });

    // Uld주입하기
    if (uldResult) {
      const { id, code, UldType } = uldResult;
      const { width, length, depth, vertexCord } = UldType as UldType;
      Ulds.push({
        id,
        code,
        width,
        length,
        depth,
        // maxWeight: uldTypeResult.maxWeight,준규님이랑 최대 문개 어떻게 넣을지 논의하기
        uldType: typeof UldType === 'object' ? UldType.code : null,
        maxWeight: 10000,
        vertexCord,
      });
    }

    // 안착대 현재 상황 묶음
    const palletRack = [];
    for (const skidPlatformHistory of skidPlatformStateArray) {
      const AwbInfo = skidPlatformHistory.Awb as Awb;
      const SkidPlatformInfo = skidPlatformHistory.SkidPlatform as SkidPlatform;
      const targetSkidPlatform = {
        id: SkidPlatformInfo.id,
        name: SkidPlatformInfo.name,
        width: AwbInfo.width,
        length: AwbInfo.length,
        depth: AwbInfo.depth,
        waterVolume: AwbInfo.waterVolume,
        weight: AwbInfo.weight,
        SCCs: AwbInfo.Scc?.map((v) => v.code),
      };
      palletRack.push(targetSkidPlatform);
    }

    // uld의 현재 상황 묶음
    const currentAWBsInULD = [];
    for (const uldHistory of uldStateArray) {
      const AwbInfo = uldHistory.Awb as Awb;
      const targetUld = {
        id: AwbInfo.id,
        name: AwbInfo.name,
        width: AwbInfo.width,
        length: AwbInfo.length,
        depth: AwbInfo.depth,
        waterVolume: AwbInfo.waterVolume,
        weight: AwbInfo.weight,
        SCCs: AwbInfo.Scc?.map((v) => v.code),
      };
      currentAWBsInULD.push(targetUld);
    }

    // 사용자가 넣는 화물
    const inputAWB = {
      id: apiRequest.id,
      palletRackId: apiRequest.palletRackId,
      name: apiRequest.name,
      width: apiRequest.width,
      length: apiRequest.length,
      depth: apiRequest.depth,
      waterVolume: apiRequest.waterVolume,
      weight: apiRequest.weight,
      SCCs: apiRequest.SCCs,
    };

    const packageSimulatorCallRequestObject = {
      mode: false,
      Awbs: Awbs,
      Ulds: Ulds,
      currentAWBsInULD: currentAWBsInULD,
      palletRack: palletRack,
      inputAWB: inputAWB,
    };

    console.log(JSON.stringify(packageSimulatorCallRequestObject));
    const psResult = await getUserSelect(packageSimulatorCallRequestObject);
    // ps에 현재 자동창고, 안착대 상태 보내기 로직 end

    try {
      const bodyResult = psResult.result[0];
      // 패키시 시뮬레이터에서 작업자 작업자시(build-up-order)정보
      // 2. 작업자 작업지시 만들기
      // 2-1. Awb의 정보 validation 체크
      if (!bodyResult.predictionResult.every((item) => item.coordinate)) {
        throw new NotFoundException('Awb 상세 정보가 없습니다.');
      }

      // 2-2. simulatorResult 입력
      const simulatorResultBody: CreateSimulatorResultDto = {
        startDate: new Date(),
        endDate: new Date(),
        loadRate: +bodyResult.squareVolumeRatio, // 적재율
        version: bodyResult?.version,
        simulation: mode,
        Uld: bodyResult.UldId,
      };
      console.log('simulatorResultBody = ', simulatorResultBody);
      const simulatorResultResult = await queryRunner.manager
        .getRepository(SimulatorResult)
        .save(simulatorResultBody);

      const joinParamArray: CreateSimulatorResultAwbJoinDto[] = [];
      const historyParamArray: CreateSimulatorHistoryDto[] = [];
      const buildUpOrderParamArray: CreateBuildUpOrderDto[] = [];

      const mqttOutOrderArray = [];

      // 2-3. 입력되는 화물과 좌표를 이력에 입력
      for (let i = 0; i < bodyResult.predictionResult.length; i++) {
        /**
         * mqtt에 보낼 화물Id + 창고(랙)Id 를 만드는 곳
         */
        const mqttReuslt = {
          order: bodyResult.predictionResult[i].order,
          awb: bodyResult.predictionResult[i].AwbId,
          asrs: bodyResult.predictionResult[i].storageId,
        };
        mqttOutOrderArray.push(mqttReuslt);

        const coordinate = bodyResult.predictionResult[i].coordinate;
        // 2-1. 어떤 Awb를 썼는지 등록
        const joinParam: CreateSimulatorResultAwbJoinDto = {
          Awb: bodyResult.predictionResult[i].AwbId, // awbId연결
          SimulatorResult: simulatorResultResult.id,
        };
        joinParamArray.push(joinParam);

        for (let j = 1; j <= coordinate.length; j++) {
          // 2-2. 어떤 Uld, 각각의 화물의 좌표 값, 시뮬레이터를 썼는지 이력저장
          const historyParam: CreateSimulatorHistoryDto = {
            Uld: bodyResult.UldId,
            Awb: bodyResult.predictionResult[i].AwbId,
            SimulatorResult: simulatorResultResult.id,
            simulation: mode,
            x: +bodyResult.predictionResult[i].coordinate[j - 1][`p${j}x`],
            y: +bodyResult.predictionResult[i].coordinate[j - 1][`p${j}y`],
            z: +bodyResult.predictionResult[i].coordinate[j - 1][`p${j}z`],
          };

          historyParamArray.push(historyParam);

          // 2-3. 작업자 작업지시를 만들기
          const buildUpOrderBody: CreateBuildUpOrderDto = {
            order: bodyResult.predictionResult[i].order,
            x: +bodyResult.predictionResult[i].coordinate[j - 1][`p${j}x`],
            y: +bodyResult.predictionResult[i].coordinate[j - 1][`p${j}y`],
            z: +bodyResult.predictionResult[i].coordinate[j - 1][`p${j}z`],
            SkidPlatform: bodyResult.predictionResult[i].order,
            Uld: bodyResult.UldId,
            Awb: bodyResult.predictionResult[i].AwbId,
          };
          buildUpOrderParamArray.push(buildUpOrderBody);
        }
      }

      const joinResult = queryRunner.manager
        .getRepository(SimulatorResultAwbJoin)
        .save(joinParamArray);
      const historyResult = queryRunner.manager
        .getRepository(SimulatorHistory)
        .save(historyParamArray);
      const buildUpOrderResult = this.buildUpOrderService.createList(
        buildUpOrderParamArray,
        queryRunner,
      );

      // 3. awbjoin 테이블, 이력 테이블 함께 저장
      const [, , buildUpOrder] = await Promise.all([
        joinResult,
        historyResult,
        buildUpOrderResult,
      ]); // 실제로 쿼리 날아가는곳

      // 1-2. 패키징 시뮬레이터에서 도출된 최적 불출순서 mqtt publish(자동창고 불출을 위함)
      if (mqttOutOrderArray)
        this.client
          .send(`hyundai/asrs1/outOrder`, mqttOutOrderArray)
          .subscribe();

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new TypeORMError(`rollback Working - ${error}`);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(query: SimulatorResult & BasicQueryParamDto) {
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
      order: orderByUtil(query.order),
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
