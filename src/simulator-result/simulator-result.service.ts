import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SimulatorResult } from './entities/simulator-result.entity';
import {
  Between,
  DataSource,
  EntityManager,
  Equal,
  FindOperator,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  QueryRunner,
  Repository,
  TypeORMError,
} from 'typeorm';
import { CreateSimulatorResultDto } from './dto/create-simulator-result.dto';
import { UpdateSimulatorResultDto } from './dto/update-simulator-result.dto';
import { Uld, UldAttribute } from '../uld/entities/uld.entity';
import { SimulatorResultAwbJoin } from '../simulator-result-awb-join/entities/simulator-result-awb-join.entity';
import { SimulatorHistory } from '../simulator-history/entities/simulator-history.entity';
import { CreateSimulatorHistoryDto } from '../simulator-history/dto/create-simulator-history.dto';
import { CreateSimulatorResultAwbJoinDto } from '../simulator-result-awb-join/dto/create-simulator-result-awb-join.dto';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { orderByUtil } from '../lib/util/orderBy.util';
import { Awb, AwbAttribute } from '../awb/entities/awb.entity';
import { AsrsHistory } from '../asrs-history/entities/asrs-history.entity';
import { SkidPlatformHistory } from '../skid-platform-history/entities/skid-platform-history.entity';
import { AsrsOutOrder } from '../asrs-out-order/entities/asrs-out-order.entity';
import { BuildUpOrder } from '../build-up-order/entities/build-up-order.entity';
import { CreateAsrsOutOrderDto } from '../asrs-out-order/dto/create-asrs-out-order.dto';
import { CreateBuildUpOrderDto } from '../build-up-order/dto/create-build-up-order.dto';
import { ClientProxy } from '@nestjs/microservices';
import { take } from 'rxjs';
import { BuildUpOrderService } from '../build-up-order/build-up-order.service';

import { PsApiRequest } from './dto/ps-input.dto';
import { Asrs } from '../asrs/entities/asrs.entity';
import {
  UldType,
  UldTypeAttribute,
} from '../uld-type/entities/uld-type.entity';
import {
  getAWBinPalletRack,
  getOrderDischarge,
  getUserSelect,
  packageSimulatorCallAll,
  reboot,
  uldDeployCheckerRequest,
} from '../lib/util/axios.util';
import { AsrsHistoryService } from '../asrs-history/asrs-history.service';
import { SkidPlatformHistoryService } from '../skid-platform-history/skid-platform-history.service';
import { userSelectInput } from './dto/user-select-input.dto';
import { SkidPlatform } from '../skid-platform/entities/skid-platform.entity';
import { UldHistoryService } from '../uld-history/uld-history.service';
import { UldHistory } from '../uld-history/entities/uld-history.entity';
import { UserSelectResult } from './dto/user-select-output';
import { AWBGroupResult } from './dto/ps-output.dto';
import { PsAllRequest } from './dto/ps-all-input.dto';
import { PsAllResult } from './dto/ps-all-output.dto';
import {
  UldDeployCheckerListRequest,
  UldDeployCheckerRequest,
} from './dto/uld-deploy-checker-input.dto';
import { AwbUtilService } from '../awb/awbUtil.service';
import { HttpExceptionFilter } from '../lib/filter/httpException.filter';

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
    @InjectRepository(Awb)
    private readonly awbRepository: Repository<Awb>,
    @InjectRepository(Asrs)
    private readonly asrsRepository: Repository<Asrs>,
    @InjectRepository(SkidPlatform)
    private readonly skidPlatformRepository: Repository<SkidPlatform>,
    @InjectRepository(Uld)
    private readonly uldRepository: Repository<Uld>,
    @Inject('MQTT_SERVICE') private client: ClientProxy,
    private dataSource: DataSource,
    private readonly buildUpOrderService: BuildUpOrderService,
    private readonly asrsHistoryService: AsrsHistoryService,
    private readonly skidPlatformHistoryService: SkidPlatformHistoryService,
    private readonly uldHistoryService: UldHistoryService,
    private readonly awbUtilService: AwbUtilService,
  ) {}

  async create(createSimulatorResultDto: CreateSimulatorResultDto) {
    const result = await this.simulatorResultRepository.save(
      createSimulatorResultDto,
    );
    return result;
  }

  // [자동창고 불출, build-up-order] 만드는 곳, ps 콜
  async createAsrsOutOrderBySimulatorResult(
    apiRequest: PsApiRequest,
    queryRunnerManager: EntityManager,
  ) {
    const queryRunner = queryRunnerManager.queryRunner;
    const mode = apiRequest.simulation; // 시뮬레이션, 커넥티드 분기

    // 자동창고의 최신 이력을 화물 기준으로 가져오기(패키지 시뮬레이터에 넘겨줄 것)
    const asrsStateArray = await this.asrsHistoryService.nowState();

    // ps에 보낼 Awb 정보들 모아두는 배열
    const Awbs = [];
    this.setCurrentAwbsInAsrs(asrsStateArray, Awbs);

    // ps에 보낼 Uld정보를 모아두는
    const Ulds = [];
    await this.setUldStateByUldCode(apiRequest, Ulds);
    if (Ulds.length <= 0) {
      throw new HttpException(`Uld 정보를 찾아오지 못했습니다.`, 400);
    }

    const packageSimulatorCallRequestObject = {
      mode: false,
      Awbs: Awbs,
      Ulds: Ulds,
    };

    this.client
      .send('hyundai/ps/input', packageSimulatorCallRequestObject)
      .pipe(take(1))
      .subscribe();
    const psResult = await getOrderDischarge(packageSimulatorCallRequestObject); // ps 콜

    try {
      const bodyResult = psResult.result[0];
      if (!(bodyResult.AWBInfoList.length > 0))
        throw new HttpException(
          'ps에서 awb 정보를 찾아오지 못했습니다. (더이상 uld에 화물을 넣지 못함)',
          400,
        );

      // 1. 자동창고 작업지시를 만들기
      const asrsOutOrderParamArray: CreateAsrsOutOrderDto[] = [];
      for (const [index, element] of bodyResult.AWBInfoList.entries()) {
        const asrsOutOrderParam: CreateAsrsOutOrderDto = {
          order: index,
          Asrs: element.storageId,
          Awb: element.AwbId,
          Uld: Ulds[0]?.id,
        };
        asrsOutOrderParamArray.push(asrsOutOrderParam);
      }
      const asrsOutOrderResult = await queryRunner.manager
        .getRepository(AsrsOutOrder)
        .save(asrsOutOrderParamArray, { reload: true });

      // 1-1. 자동창고 작업지시 데이터 mqtt로 publish 하기
      // 자동창고 작업지시가 생성되었을 때만 동작합니다.
      if (asrsOutOrderResult) {
        // 자동창고 작업지시를 객체형태로 mqtt에 publish하기 위한 find 과정
        const asrsResult = await this.getAsrsResult(
          queryRunner,
          asrsOutOrderResult,
        );
        // 불출순서를 mqtt에 배열로 보내기위해 전처리 과정
        const asrsOutOrder = asrsResult.map((asrsOutOrderElement) => {
          const Awb = asrsOutOrderElement.Awb as Awb;
          const Asrs = asrsOutOrderElement.Asrs as Asrs;
          return {
            order: asrsOutOrderElement.order,
            asrs: Asrs.name,
            awb: Awb.barcode,
          };
        });

        // 1-2. 패키징 시뮬레이터에서 도출된 최적 불출순서 mqtt publish(자동창고 불출을 위함)
        this.client.send(`hyundai/asrs1/outOrder`, asrsOutOrder).subscribe();

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
        const buildUpOrderParamArray: CreateBuildUpOrderDto[] = [];

        // 2-3. 입력되는 화물과 좌표를 이력에 입력
        this.makeHistoryAndBuildUpOrderMethod(
          bodyResult,
          simulatorResultResult,
          joinParamArray,
          mode,
          historyParamArray,
          buildUpOrderParamArray,
        );

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
        await Promise.all([joinResult, historyResult, buildUpOrderResult]); // 실제로 쿼리 날아가는곳

        // 1-3. 최적 불출순서를 자동창고(ASRS) PLC에 write 완료했다는 신호
        this.client
          .send(`hyundai/asrs1/writeCompl`, { writeOrder: true })
          .pipe(take(1))
          .subscribe();
      }

      return psResult;
    } catch (error) {
      throw new TypeORMError(`rollback Working - ${error}`);
    }
  }

  // 패키지 시뮬레이터의 userSelect 실행
  async createUserSelect(
    apiRequest: userSelectInput,
    queryRunnerManager: EntityManager,
  ) {
    const queryRunner = queryRunnerManager.queryRunner;
    const mode = apiRequest.simulation; // 시뮬레이션, 커넥티드 분기

    // 자동창고 최신 이력을 화물 기준으로 가져오기(패키지 시뮬레이터에 넘겨줄 것
    const asrsStateArray = await this.asrsHistoryService.nowState();
    // 안착대의 최신 이력을 화물 기준으로 가져오기(패키지 시뮬레이터에 넘겨줄 것)
    const skidPlatformStateArray =
      await this.skidPlatformHistoryService.nowVirtualState(false, true);
    // uld의 최신 이력을 uldCode 기준으로 가져오기(패키지 시뮬레이터에 넘겨줄 것)
    const uldStateArray = await this.uldHistoryService.nowState(
      apiRequest.UldCode,
    );

    // ps에 현재 자동창고, 안착대 상태 보내기 로직 start
    // 현재 ASRS의 정보들
    const Awbs = [];
    this.setCurrentAwbsInAsrs(asrsStateArray, Awbs);

    // ps에 보낼 Uld정보를 모아두는
    const Ulds = [];
    await this.setUldStateByUldCode(apiRequest, Ulds);
    if (Ulds.length <= 0)
      throw new HttpException(`Uld 정보를 찾아오지 못했습니다.`, 400);

    // 안착대 현재 상황 묶음
    const palletRack = [];
    this.setCurrentSkidPlatform(skidPlatformStateArray, palletRack);
    if (palletRack.length <= 0)
      throw new HttpException(`파레트 정보를 찾아오지 못했습니다.`, 400);

    // uld의 현재 상황 묶음
    const currentAWBsInULD = [];
    this.setCurrentAwbInUld(uldStateArray, currentAWBsInULD);

    // 사용자가 넣는 화물
    const inputAWB = {
      id: apiRequest.id || 0,
      palletRackId: apiRequest.palletRackId,
      name: apiRequest.barcode,
      separateNumber: apiRequest.separateNumber,
      width: apiRequest.width,
      length: apiRequest.length,
      depth: apiRequest.depth,
      waterVolume: apiRequest.waterVolume,
      weight: apiRequest.weight,
      destination: apiRequest.destination,
      SCCs: apiRequest.SCCs,
    };

    if (!inputAWB.name) {
      throw new NotFoundException(
        `inputAWB 정보가 잘못되었습니다. id: ${inputAWB.id}, palletRackId: ${inputAWB.palletRackId}, name: ${inputAWB.name}, separateNumber: ${inputAWB.separateNumber}`,
      );
    }

    const packageSimulatorCallRequestObject = {
      mode: false,
      Awbs: Awbs,
      Ulds: Ulds,
      currentAWBsInULD: currentAWBsInULD,
      palletRack: palletRack,
      inputAWB: inputAWB,
    };
    this.client
      .send('hyundai/ps/input', packageSimulatorCallRequestObject)
      .pipe()
      .subscribe();
    const psResult = await getUserSelect(packageSimulatorCallRequestObject); // ps 콜
    this.client.send('hyundai/ps/result', psResult).pipe(take(1)).subscribe();

    // ps의 결과가 Failure로 올 때 예외 처리
    if (psResult.inputState !== 'Success') {
      return psResult;
    }

    try {
      const bodyResult = psResult.result[0];
      // 1. 자동창고 작업지시를 만들기
      const asrsOutOrderParamArray: CreateAsrsOutOrderDto[] = [];

      for (const [index, element] of bodyResult.predictionResult.entries()) {
        const asrsOutOrderParam: CreateAsrsOutOrderDto = {
          order: index,
          Asrs: element.storageId,
          Awb: element.AwbId,
          Uld: Ulds[0]?.id,
        };
        if (asrsOutOrderParam.Asrs !== 0)
          asrsOutOrderParamArray.push(asrsOutOrderParam);
      }
      const asrsOutOrderResult = await queryRunner.manager
        .getRepository(AsrsOutOrder)
        .save(asrsOutOrderParamArray);

      // 1-1. 자동창고 작업지시 데이터 mqtt로 publish 하기
      // 자동창고 작업지시가 생성되었을 때만 동작합니다.
      if (asrsOutOrderResult) {
        // 자동창고 작업지시를 객체형태로 mqtt에 publish하기 위한 find 과정
        const asrsResult = await this.getAsrsResult(
          queryRunner,
          asrsOutOrderResult,
        );

        // 불출순서를 mqtt에 배열로 보내기위해 전처리 과정
        const asrsOutOrder = asrsResult.map((asrsOutOrderElement) => {
          const Awb = asrsOutOrderElement.Awb as Awb;
          const Asrs = asrsOutOrderElement.Asrs as Asrs;
          return {
            order: asrsOutOrderElement.order,
            asrs: Asrs.name,
            awb: Awb.barcode,
          };
        });

        // 1-2. 패키징 시뮬레이터에서 도출된 최적 불출순서 mqtt publish(자동창고 불출을 위함)
        this.client.send(`hyundai/asrs1/outOrder`, asrsOutOrder).subscribe();

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
        const buildUpOrderParamArray: CreateBuildUpOrderDto[] = [];

        // 2-3. 입력되는 화물과 좌표를 이력에 입력
        this.makeHistoryAndBuildUpOrderMethod(
          bodyResult,
          simulatorResultResult,
          joinParamArray,
          mode,
          historyParamArray,
          buildUpOrderParamArray,
        );

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
        await Promise.all([joinResult, historyResult, buildUpOrderResult]); // 실제로 쿼리 날아가는곳

        // 1-3. 최적 불출순서를 자동창고(ASRS) PLC에 write 완료했다는 신호
        this.client
          .send(`hyundai/asrs1/writeCompl`, { writeOrder: true })
          .pipe(take(1))
          .subscribe();
      }

      return psResult;
    } catch (error) {
      throw new TypeORMError(`rollback Working - ${error}`);
    }
  }

  // 패키지 시뮬레이터에서 자동창고, 안착대 정보로만 [자동창고 불출] 만드는 곳
  async reboot(apiRequest: PsApiRequest, queryRunnerManager: EntityManager) {
    const queryRunner = queryRunnerManager.queryRunner;
    const mode = apiRequest.simulation; // 시뮬레이션, 커넥티드 분기

    // 자동창고의 최신 이력을 화물 기준으로 가져오기(패키지 시뮬레이터에 넘겨줄 것)
    const asrsStateArray = await this.asrsHistoryService.nowState();

    // 안착대의 최신 이력을 화물 기준으로 가져오기(패키지 시뮬레이터에 넘겨줄 것)
    const skidPlatformStateArray =
      await this.skidPlatformHistoryService.nowVirtualState(false, true);

    // ps에 보낼 Awb 정보들 모아두는 배열
    const Awbs = [];
    this.setCurrentAwbsInAsrs(asrsStateArray, Awbs);
    // if (Awbs.length <= 0) throw new HttpException(`창고 이력이 없습니다.`, 400);

    // ps에 보낼 Uld정보를 모아두는
    const Ulds = [];
    await this.setUldStateByUldCode(apiRequest, Ulds);
    if (Ulds.length <= 0)
      throw new HttpException(`Uld 정보를 찾아오지 못했습니다.`, 400);

    // 안착대 현재 상황 묶음
    const palletRack = [];
    this.setCurrentSkidPlatform(skidPlatformStateArray, palletRack);

    const packageSimulatorCallRequestObject = {
      mode: false,
      Awbs: Awbs,
      Ulds: Ulds,
      palletRack: palletRack,
    };

    const psResult = await reboot(packageSimulatorCallRequestObject);
    // ps에 현재 자동창고, 안착대 상태 보내기 로직 end

    try {
      const bodyResult = psResult.result[0];
      // 1. 자동창고 작업지시를 만들기
      const asrsOutOrderParamArray: CreateAsrsOutOrderDto[] = [];
      for (const [index, element] of bodyResult.AWBInfoList.entries()) {
        // storageId가 0이면 안착대에 있는 화물이라는 뜻 즉, 창고에서 불출될 일이 없기 때문에 작업지시를 못내리기 때문에 0 예외처리
        if (element.storageId !== 0) {
          const asrsOutOrderParam: CreateAsrsOutOrderDto = {
            order: index,
            Asrs: element.storageId,
            Awb: element.AwbId,
            Uld: Ulds[0]?.id,
          };
          asrsOutOrderParamArray.push(asrsOutOrderParam);
        }
      }
      const asrsOutOrderResult = await queryRunner.manager
        .getRepository(AsrsOutOrder)
        .save(asrsOutOrderParamArray);

      // 1-1. 자동창고 작업지시 데이터 mqtt로 publish 하기
      // 자동창고 작업지시가 생성되었을 때만 동작합니다.
      if (asrsOutOrderResult) {
        // 자동창고 작업지시를 객체형태로 mqtt에 publish하기 위한 find 과정
        const asrsResult = await this.getAsrsResult(
          queryRunner,
          asrsOutOrderResult,
        );

        // 불출순서를 mqtt에 배열로 보내기위해 전처리 과정
        const asrsOutOrder = asrsResult.map((asrsOutOrderElement) => {
          const Awb = asrsOutOrderElement.Awb as Awb;
          const Asrs = asrsOutOrderElement.Asrs as Asrs;
          return {
            order: asrsOutOrderElement.order,
            asrs: Asrs.name,
            awb: Awb.barcode,
          };
        });

        // 1-2. 패키징 시뮬레이터에서 도출된 최적 불출순서 mqtt publish(자동창고 불출을 위함)
        this.client.send(`hyundai/asrs1/outOrder`, asrsOutOrder).subscribe();

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

        // 1-3. 최적 불출순서를 자동창고(ASRS) PLC에 write 완료했다는 신호
        this.client
          .send(`hyundai/asrs1/writeCompl`, { writeOrder: true })
          .pipe(take(1))
          .subscribe();
      }

      return psResult;
    } catch (error) {
      throw new TypeORMError(`rollback Working - ${error}`);
    }
  }

  // 패키지 시뮬레이터의 결과로 [안착대 추천도] 반환하는 곳
  async getAWBinPalletRack(apiRequest: userSelectInput) {
    try {
      const mode = apiRequest.simulation; // 시뮬레이션, 커넥티드 분기

      // 자동창고 최신 이력을 화물 기준으로 가져오기(패키지 시뮬레이터에 넘겨줄 것
      const asrsStateArray = await this.asrsHistoryService.nowState();
      // 안착대의 최신 이력을 화물 기준으로 가져오기(패키지 시뮬레이터에 넘겨줄 것)
      const skidPlatformStateArray =
        await this.skidPlatformHistoryService.nowVirtualState(false, true);
      // uld의 최신 이력을 uldCode 기준으로 가져오기(패키지 시뮬레이터에 넘겨줄 것)
      const uldStateArray = await this.uldHistoryService.nowState(
        apiRequest.UldCode,
      );

      // ps에 현재 자동창고, 안착대 상태 보내기 로직 start
      // ps에 보낼 Awb 정보들 모아두는 배열
      const Awbs = [];
      console.time('asrs setting part');
      this.setCurrentAwbsInAsrs(asrsStateArray, Awbs);
      console.timeEnd('asrs setting part');

      // ps에 보낼 Uld정보를 모아두는
      const Ulds = [];
      console.time('uld setting part');
      await this.setUldStateByUldCode(apiRequest, Ulds);
      console.timeEnd('uld setting part');
      if (Ulds.length <= 0)
        throw new HttpException(`Uld 정보를 찾아오지 못했습니다.`, 400);

      // 안착대 현재 상황 묶음
      const palletRack = [];
      console.time('skidPlatform setting part');
      this.setCurrentSkidPlatform(skidPlatformStateArray, palletRack);
      console.timeEnd('skidPlatform setting part');

      // uld의 현재 상황 묶음
      const currentAWBsInULD = [];
      this.setCurrentAwbInUld(uldStateArray, currentAWBsInULD);

      const packageSimulatorCallRequestObject = {
        mode: false,
        Awbs: Awbs,
        Ulds: Ulds,
        currentAWBsInULD: currentAWBsInULD,
        palletRack: palletRack,
      };

      console.time('ps Call part');
      this.client
        .send('hyundai/ps/input', packageSimulatorCallRequestObject)
        .pipe(take(1))
        .subscribe();
      const psResult = await getAWBinPalletRack(
        packageSimulatorCallRequestObject,
      );

      console.timeEnd('ps Call part');

      // 안착대 추천도 결과를 mqtt에 전송
      this.client
        .send('hyundai/ps/recommend', psResult)
        .pipe(take(1))
        .subscribe();
      return psResult;
    } catch (e) {
      throw new HttpException(
        `정보를 정확히 입력해주세요 ${e}`,
        e.status || 400,
      );
    }
  }

  // uld, 안착대, 창고의 모든 정보를 가져와서 ps 결과를 반환하는 곳
  async psAll(apiRequest: PsAllRequest, queryRunnerManager: EntityManager) {
    const queryRunner = queryRunnerManager.queryRunner;
    const mode = apiRequest.simulation; // 시뮬레이션, 커넥티드 분기

    // 자동창고 최신 이력을 화물 기준으로 가져오기(패키지 시뮬레이터에 넘겨줄 것
    const asrsStateArray = await this.asrsHistoryService.nowState();
    // 안착대의 최신 이력을 화물 기준으로 가져오기(패키지 시뮬레이터에 넘겨줄 것)
    const skidPlatformStateArray =
      await this.skidPlatformHistoryService.nowVirtualState(false, true);
    // uld의 최신 이력을 uldCode 기준으로 가져오기(패키지 시뮬레이터에 넘겨줄 것)
    const uldStateArray = await this.uldHistoryService.nowState(
      apiRequest.UldCode,
    );

    // ps에 현재 자동창고, 안착대 상태 보내기 로직 start
    // 현재 ASRS의 정보들
    const Awbs = [];
    this.setCurrentAwbsInAsrs(asrsStateArray, Awbs);
    // if (Awbs.length <= 0) throw new HttpException(`창고 이력이 없습니다.`, 400);

    // ps에 보낼 Uld정보를 모아두는
    const Ulds = [];
    await this.setUldStateByUldCode(apiRequest, Ulds);
    if (Ulds.length <= 0)
      throw new HttpException(`Uld 정보를 찾아오지 못했습니다.`, 400);

    // 안착대 현재 상황 묶음
    const palletRack = [];
    this.setCurrentSkidPlatform(skidPlatformStateArray, palletRack);

    // uld의 현재 상황 묶음
    const currentAWBsInULD = [];
    this.setCurrentAwbInUld(uldStateArray, currentAWBsInULD);

    const packageSimulatorCallRequestObject = {
      mode: false,
      Awbs: Awbs,
      Ulds: Ulds,
      currentAWBsInULD: currentAWBsInULD,
      palletRack: palletRack,
    };

    this.client
      .send('hyundai/ps/input', packageSimulatorCallRequestObject)
      .pipe(take(1))
      .subscribe();
    const psResult = await packageSimulatorCallAll(
      packageSimulatorCallRequestObject,
    );
    this.client.send('hyundai/ps/result', psResult).pipe(take(1)).subscribe();

    try {
      const bodyResult = psResult.result[0];
      // uld에 더이상 화물이 들어가지 못합니다.
      if (bodyResult.isDone) return psResult;

      // 1. 자동창고 작업지시를 만들기
      const asrsOutOrderParamArray: CreateAsrsOutOrderDto[] = [];
      for (const [index, element] of bodyResult.AWBInfoList.entries()) {
        const asrsOutOrderParam: CreateAsrsOutOrderDto = {
          order: index,
          Asrs: element.storageId,
          Awb: element.AwbId,
          Uld: Ulds[0]?.id,
        };
        if (asrsOutOrderParam.Asrs !== 0)
          asrsOutOrderParamArray.push(asrsOutOrderParam);
      }
      const asrsOutOrderResult = await queryRunner.manager
        .getRepository(AsrsOutOrder)
        .save(asrsOutOrderParamArray);

      // 1-1. 자동창고 작업지시 데이터 mqtt로 publish 하기
      // 자동창고 작업지시가 생성되었을 때만 동작합니다.
      if (asrsOutOrderResult) {
        // 자동창고 작업지시를 객체형태로 mqtt에 publish하기 위한 find 과정
        const asrsResult = await this.getAsrsResult(
          queryRunner,
          asrsOutOrderResult,
        );

        // 불출순서를 mqtt에 배열로 보내기위해 전처리 과정
        const asrsOutOrder = asrsResult.map((asrsOutOrderElement) => {
          const Awb = asrsOutOrderElement.Awb as Awb;
          const Asrs = asrsOutOrderElement.Asrs as Asrs;
          return {
            order: asrsOutOrderElement.order,
            asrs: Asrs.name,
            awb: Awb.barcode,
          };
        });

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
        const buildUpOrderParamArray: CreateBuildUpOrderDto[] = [];

        // 2-3. 입력되는 화물과 좌표를 이력에 입력
        this.makeHistoryAndBuildUpOrderMethod(
          bodyResult,
          simulatorResultResult,
          joinParamArray,
          mode,
          historyParamArray,
          buildUpOrderParamArray,
        );

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
        await Promise.all([joinResult, historyResult, buildUpOrderResult]); // 실제로 쿼리 날아가는곳
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

      return psResult;
    } catch (error) {
      throw new TypeORMError(`rollback Working - ${error}`);
    }
  }

  // psAll에서 ps로 보내는 body를 확인하기 위한 용도
  async psAllInput(
    apiRequest: PsAllRequest,
    queryRunnerManager: EntityManager,
  ) {
    const queryRunner = queryRunnerManager.queryRunner;

    const mode = apiRequest.simulation; // 시뮬레이션, 커넥티드 분기

    // 자동창고 최신 이력을 화물 기준으로 가져오기(패키지 시뮬레이터에 넘겨줄 것
    const asrsStateArray = await this.asrsHistoryService.nowState();
    // 안착대의 최신 이력을 화물 기준으로 가져오기(패키지 시뮬레이터에 넘겨줄 것)
    const skidPlatformStateArray =
      await this.skidPlatformHistoryService.nowVirtualState(false, true);
    // uld의 최신 이력을 uldCode 기준으로 가져오기(패키지 시뮬레이터에 넘겨줄 것)
    const uldStateArray = await this.uldHistoryService.nowState(
      apiRequest.UldCode,
    );

    // 현재 ASRS의 정보들
    const Awbs = [];
    this.setCurrentAwbsInAsrs(asrsStateArray, Awbs);

    // ps에 보낼 Uld정보를 모아두는
    const Ulds = [];
    await this.setUldStateByUldCode(apiRequest, Ulds);
    if (Ulds.length <= 0)
      throw new HttpException(`Uld 정보를 찾아오지 못했습니다.`, 400);

    // 안착대 현재 상황 묶음
    const palletRack = [];
    this.setCurrentSkidPlatform(skidPlatformStateArray, palletRack);

    // uld의 현재 상황 묶음
    const currentAWBsInULD = [];
    this.setCurrentAwbInUld(uldStateArray, currentAWBsInULD);

    const packageSimulatorCallRequestObject = {
      mode: false,
      Awbs: Awbs,
      Ulds: Ulds,
      currentAWBsInULD: currentAWBsInULD,
      palletRack: palletRack,
    };

    return packageSimulatorCallRequestObject;
  }

  // 해포된 화물이 uld안에 들어갈 수 있는지 확인하기 위한 메서드
  async uldDeployChecker(
    apiRequest: UldDeployCheckerRequest,
    queryRunnerManager: EntityManager,
  ) {
    const queryRunner = queryRunnerManager.queryRunner;
    const mode = apiRequest.simulation; // 시뮬레이션, 커넥티드 분기

    // uld의 최신 이력을 uldCode 기준으로 가져오기(패키지 시뮬레이터에 넘겨줄 것)
    const uldStateArray = await this.uldHistoryService.nowState(
      apiRequest.UldCode,
    );

    // ps에 보낼 Uld정보를 모아두는
    const Ulds = [];
    await this.setUldStateByUldCode(apiRequest, Ulds);
    if (Ulds.length <= 0)
      throw new HttpException(`Uld 정보를 찾아오지 못했습니다.`, 400);

    // uld의 현재 상황 묶음
    const currentAWBsInULD = [];
    this.setCurrentAwbInUld(uldStateArray, currentAWBsInULD);

    // 화물검색
    if (!apiRequest.awbId) {
      throw new HttpException('awb 정보를 찾아오지 못했습니다', 400);
    }

    if (typeof apiRequest.awbId !== 'number') {
      throw new HttpException('awbId를 입력해주세요.', 400);
    }

    const awbInfo = await this.awbUtilService.findExistingAwbById(
      queryRunner,
      apiRequest.awbId,
    );

    // 사용자가 넣는 화물
    const inputAWB = {
      barcode: awbInfo.barcode,
      width: awbInfo.width,
      length: awbInfo.length,
      depth: awbInfo.depth,
      waterVolume: awbInfo.waterVolume,
      weight: awbInfo.weight,
      destination: awbInfo.destination,
      SCCs: awbInfo.Scc.map((s) => s.code),
    };
    const packageSimulatorCallRequestObject = {
      mode: false,
      Ulds: Ulds,
      currentAWBsInULD: currentAWBsInULD,
      inputAWB: inputAWB,
    };
    this.client
      .send('hyundai/ps/input', packageSimulatorCallRequestObject)
      .pipe()
      .subscribe();

    // ps 콜
    const psResult = await uldDeployCheckerRequest(
      packageSimulatorCallRequestObject,
    );

    // this.client.send('hyundai/ps/result', psResult).pipe(take(1)).subscribe();

    if (psResult?.code !== 200) {
      throw new HttpException('ps 결과가 잘못되었습니다.', 400);
    }

    return psResult.result.fit;
  }

  // 해포된 화물이 uld안에 들어갈 수 있는지 확인하기 위한 메서드(awb List 용도)
  async uldDeployCheckerList(
    apiRequest: UldDeployCheckerListRequest,
    queryRunnerManager: EntityManager,
  ) {
    const queryRunner = queryRunnerManager.queryRunner;
    const mode = apiRequest.simulation; // 시뮬레이션, 커넥티드 분기

    // uld의 최신 이력을 uldCode 기준으로 가져오기(패키지 시뮬레이터에 넘겨줄 것)
    const uldStateArray = await this.uldHistoryService.nowState(
      apiRequest.UldCode,
    );

    // ps에 보낼 Uld정보를 모아두는
    const Ulds = [];
    await this.setUldStateByUldCode(apiRequest, Ulds);
    if (Ulds.length <= 0)
      throw new HttpException(`Uld 정보를 찾아오지 못했습니다.`, 400);

    // uld의 현재 상황 묶음
    const currentAWBsInULD = [];
    this.setCurrentAwbInUld(uldStateArray, currentAWBsInULD);

    // 화물검색
    if (!apiRequest.awbIdList) {
      throw new HttpException('awb 정보를 찾아오지 못했습니다', 400);
    }

    if (typeof apiRequest.awbIdList === 'number') {
      throw new HttpException('awbId의 배열을 입력해주세요.', 400);
    }

    const awbInfoList = await this.awbUtilService.findExistingAwbListById(
      queryRunner,
      apiRequest.awbIdList,
    );

    const resultObjectFromPsResult = await Promise.allSettled(
      awbInfoList.map(async (awbInfo) => {
        const inputAWB = {
          barcode: awbInfo.barcode,
          width: awbInfo.width,
          length: awbInfo.length,
          depth: awbInfo.depth,
          waterVolume: awbInfo.waterVolume,
          weight: awbInfo.weight,
          destination: awbInfo.destination,
          SCCs: awbInfo.Scc.map((s) => s.code),
        };

        const packageSimulatorCallRequestObject = {
          mode: false,
          Ulds: Ulds,
          currentAWBsInULD: currentAWBsInULD,
          inputAWB: inputAWB,
        };

        const psResult = await uldDeployCheckerRequest(
          packageSimulatorCallRequestObject,
        );

        if (psResult?.code !== 200) {
          throw new HttpException('ps 결과가 잘못되었습니다.', 400);
        }

        return {
          awbId: awbInfo.id,
          fit: psResult.result.fit,
        };
      }),
    );

    return resultObjectFromPsResult.map((result) =>
      result.status === 'fulfilled' ? result.value : null,
    );
  }

  // 현재 자동창고, 안착대 상황을 한번에 보여주기
  async inputGroup() {
    // 자동창고 최신 이력을 화물 기준으로 가져오기(패키지 시뮬레이터에 넘겨줄 것
    const asrsStateArray = await this.asrsHistoryService.nowState();
    // 안착대의 최신 이력을 화물 기준으로 가져오기(패키지 시뮬레이터에 넘겨줄 것)
    const skidPlatformStateArray =
      await this.skidPlatformHistoryService.nowVirtualState(false, true);

    // 현재 ASRS의 정보들
    const Awbs = [];
    this.setCurrentAwbsInAsrs(asrsStateArray, Awbs);
    if (Awbs.length <= 0) throw new HttpException(`창고 이력이 없습니다.`, 400);

    // 안착대 현재 상황 묶음
    const palletRack = [];
    this.setCurrentSkidPlatform(skidPlatformStateArray, palletRack);

    const packageSimulatorCallRequestObject = {
      mode: false,
      Awbs: Awbs.map((v) => v.id),
      palletRack: palletRack.map((v) => v.id),
    };
    return packageSimulatorCallRequestObject;
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

  // 작업지시(asrs-out-order)를 객체형태로 만들기 위한 method
  private async getAsrsResult(
    queryRunner: QueryRunner,
    asrsOutOrderResult: CreateAsrsOutOrderDto[],
  ) {
    return await queryRunner.manager.getRepository(AsrsOutOrder).find({
      relations: {
        Asrs: true,
        Awb: true,
      },
      select: {
        Asrs: { id: true, name: true },
        Awb: { id: true, barcode: true },
      },
      where: {
        id: In(asrsOutOrderResult.map((v) => v.id)),
      },
      order: { order: 'asc' },
    });
  }

  // uld가 type인지, vertexCord를 계산하기 위한 method
  private async setUldStateByUldCode(
    apiRequest:
      | PsApiRequest
      | userSelectInput
      | PsAllRequest
      | UldDeployCheckerRequest
      | UldDeployCheckerListRequest,
    Ulds: any[],
  ) {
    try {
      const uldResult = await this.uldRepository.findOne({
        select: {
          UldType: UldTypeAttribute,
        },
        relations: {
          UldType: true,
        },
        where: {
          code: apiRequest.UldCode ? Equal(apiRequest.UldCode) : undefined,
        },
      });

      if (!uldResult) {
        return new NotFoundException('uld가 없습니다.');
      }

      // Uld주입하기
      const { id, code, UldType } = uldResult;
      const { width, length, depth, vertexCord } = UldType as UldType;
      if (typeof UldType === 'object' && UldType.code.includes('_')) {
        UldType.code = UldType.code.split('_')[0];
      }

      Ulds.push({
        id,
        code,
        width,
        length,
        depth,
        uldType: typeof UldType === 'object' ? UldType.code : null,
        vertexCord,
      });
    } catch (e) {
      throw new NotFoundException(e);
    }
  }

  // 현재 asrs이력을 보고 ps에넘길 객체로 변환을 위한 method
  private setCurrentAwbsInAsrs(asrsStateArray: AsrsHistory[], Awbs: any[]) {
    for (const asrsHistory of asrsStateArray) {
      const AwbInfo = asrsHistory.Awb as Awb;
      const AsrsInfo = asrsHistory.Asrs as Asrs;
      const targetAwb = {
        id: AwbInfo.id,
        storageId: AsrsInfo.id,
        name: AwbInfo.barcode,
        separateNumber: AwbInfo.separateNumber.toString(),
        width: AwbInfo.width,
        length: AwbInfo.length,
        depth: AwbInfo.depth,
        waterVolume: AwbInfo.waterVolume,
        weight: AwbInfo.weight,
        destination: AwbInfo.destination,
        SCCs: AwbInfo.Scc?.map((v) => v.code),
      };

      // 화물의 체적이 null이 들어오는 경우를 방지함
      if (!targetAwb.width) {
        throw new HttpException(
          `403 체적데이터가 없는 화물이 있습니다. barcode = ${AwbInfo.barcode} separateNumber = ${AwbInfo.separateNumber}`,
          403,
        );
      }

      Awbs.push(targetAwb);
    }
  }

  // 현재 uld에 어떤 화물이 있는지 확인을 위한 method
  private setCurrentAwbInUld(
    uldStateArray: UldHistory[],
    currentAWBsInULD: any[],
  ) {
    for (const uldHistory of uldStateArray) {
      const AwbInfo = uldHistory.Awb as Awb;
      const targetUld = {
        id: AwbInfo.id,
        name: AwbInfo.barcode,
        separateNumber: AwbInfo.separateNumber.toString(),
        width: AwbInfo.width,
        length: AwbInfo.length,
        depth: AwbInfo.depth,
        waterVolume: AwbInfo.waterVolume,
        weight: AwbInfo.weight,
        destination: AwbInfo.destination,
        SCCs: AwbInfo.Scc?.map((v) => v.code),
      };
      currentAWBsInULD.push(targetUld);
    }
  }

  // 현재 안착대에 어떤 화물이 있는지 확인을 위한 method
  private setCurrentSkidPlatform(
    skidPlatformStateArray: SkidPlatformHistory[],
    palletRack: any[],
  ) {
    for (const skidPlatformHistory of skidPlatformStateArray) {
      const AwbInfo = skidPlatformHistory.Awb as Awb;
      const SkidPlatformInfo = skidPlatformHistory.SkidPlatform as SkidPlatform;
      const targetSkidPlatform = {
        id: AwbInfo.id,
        name: AwbInfo.barcode,
        separateNumber: AwbInfo.separateNumber.toString(),
        width: AwbInfo.width,
        length: AwbInfo.length,
        depth: AwbInfo.depth,
        waterVolume: AwbInfo.waterVolume,
        weight: AwbInfo.weight,
        destination: AwbInfo.destination,
        SCCs: AwbInfo.Scc?.map((v) => v.code),
        palletRackId: SkidPlatformInfo.id, // pallet의 id를 ps에 넘겨주기 위함
      };
      // 화물의 체적이 null이 들어오는 경우를 방지함
      if (!targetSkidPlatform.width) {
        throw new HttpException(
          `403 체적데이터가 없는 화물이 있습니다. barcode = ${AwbInfo.barcode} separateNumber = ${AwbInfo.separateNumber}`,
          403,
        );
      }
      palletRack.push(targetSkidPlatform);
    }
  }

  // ps의 결과로 history, buildUpOrder를 만들 때 사용하는 method
  private makeHistoryAndBuildUpOrderMethod(
    bodyResult: UserSelectResult | AWBGroupResult | PsAllResult,
    simulatorResultResult: SimulatorResult,
    joinParamArray: CreateSimulatorResultAwbJoinDto[],
    mode: boolean,
    historyParamArray: CreateSimulatorHistoryDto[],
    buildUpOrderParamArray: CreateBuildUpOrderDto[],
  ) {
    // predictionResult가 있을 때 predictionResult를 기준으로 동작
    if (typeof bodyResult === 'object' && 'predictionResult' in bodyResult) {
      for (let i = 0; i < bodyResult.predictionResult.length; i++) {
        /**
         * mqtt에 보낼 화물Id + 창고(랙)Id 를 만드는 곳
         */
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
            SkidPlatform: i === 0 ? bodyResult.palletRackId : null, // 어느 안착대로 가는지 첫 번재 화물만 특정되니 나머지는 null 처리
            Uld: bodyResult.UldId,
            Awb: bodyResult.predictionResult[i].AwbId,
          };

          buildUpOrderParamArray.push(buildUpOrderBody);
        }
      }
    } else if (
      (typeof bodyResult === 'object' && 'AWBInfoList' in bodyResult) ||
      (typeof bodyResult === 'object' && 'PsAllResult' in bodyResult)
    ) {
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
          // 2-3. 작업자 작업지시를 만들기
          // 꼭지점 좌표를 모두 저장하기
          const buildUpOrderBody: CreateBuildUpOrderDto = {
            order: bodyResult.AWBInfoList[i].order,
            x: +bodyResult.AWBInfoList[i].coordinate[j - 1][`p${j}x`],
            y: +bodyResult.AWBInfoList[i].coordinate[j - 1][`p${j}y`],
            z: +bodyResult.AWBInfoList[i].coordinate[j - 1][`p${j}z`],
            // SkidPlatform: i === 0 ? bodyResult.palletRackId : null, // 어느 안착대로 가는지 첫 번재 화물만 특정되니 나머지는 null 처리
            SkidPlatform: null, // 어떤 화물이 어떤 안착대로 가는지 모르기 때문에 null 처리
            Uld: bodyResult.UldId,
            Awb: bodyResult.AWBInfoList[i].AwbId,
          };
          buildUpOrderParamArray.push(buildUpOrderBody);
        }
      }
    }
  }
}
