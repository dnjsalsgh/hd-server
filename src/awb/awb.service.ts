import {
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAwbDto } from './dto/create-awb.dto';
import { UpdateAwbDto } from './dto/update-awb.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  DataSource,
  EntityManager,
  Equal,
  FindOperator,
  ILike,
  In,
  IsNull,
  Not,
  LessThanOrEqual,
  MoreThanOrEqual,
  QueryRunner,
  Repository,
  TypeORMError,
} from 'typeorm';
import { Awb } from './entities/awb.entity';
import { AwbSccJoin } from '../awb-scc-join/entities/awb-scc-join.entity';
import { Scc } from '../scc/entities/scc.entity';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { orderByUtil } from '../lib/util/orderBy.util';
import { FileService } from '../file/file.service';
import { Vms3D } from '../vms/entities/vms.entity';
import { MqttService } from '../mqtt.service';
import { SccService } from '../scc/scc.service';
import { Vms2d } from '../vms2d/entities/vms2d.entity';
import { CreateVmsDto } from '../vms/dto/create-vms.dto';
import { CreateVms2dDto } from '../vms2d/dto/create-vms2d.dto';
import { AwbUtilService } from './awbUtil.service';
import { InjectionSccDto } from './dto/injection-scc.dto';
import { VmsAwbResult } from '../vms-awb-result/entities/vms-awb-result.entity';
import { CreateVmsAwbResultDto } from '../vms-awb-result/dto/create-vms-awb-result.dto';
import { CreateVmsAwbHistoryDto } from '../vms-awb-history/dto/create-vms-awb-history.dto';
import { VmsAwbHistory } from '../vms-awb-history/entities/vms-awb-history.entity';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { PrepareBreakDownAwbInputDto } from './dto/prepare-break-down-awb-input.dto';
import { breakDownRequest } from '../lib/util/axios.util';
import { breakDownAwb } from './dto/prepare-break-down-awb-output.dto';
import { CreateSkidPlatformHistoryDto } from '../skid-platform-history/dto/create-skid-platform-history.dto';
import { SkidPlatformHistoryService } from '../skid-platform-history/skid-platform-history.service';

@Injectable()
export class AwbService {
  constructor(
    @InjectRepository(Awb)
    private readonly awbRepository: Repository<Awb>,
    @InjectRepository(Scc)
    private readonly sccRepository: Repository<Scc>,
    @InjectRepository(Vms3D, 'mssqlDB')
    private readonly vmsRepository: Repository<Vms3D>,
    @InjectRepository(Vms2d, 'mssqlDB')
    private readonly vms2dRepository: Repository<Vms2d>,
    @InjectRepository(VmsAwbResult, 'dimoaDB')
    private readonly vmsAwbResultRepository: Repository<VmsAwbResult>,
    @InjectRepository(VmsAwbHistory, 'dimoaDB')
    private readonly vmsAwbHistoryRepository: Repository<VmsAwbHistory>,
    private dataSource: DataSource,
    private readonly fileService: FileService,
    private readonly mqttService: MqttService,
    private readonly sccService: SccService,
    private readonly awbUtilService: AwbUtilService,
    private readonly skidPlatformHistoryService: SkidPlatformHistoryService,
  ) {}

  async create(createAwbDto: CreateAwbDto, queryRunnerManager: EntityManager) {
    const { scc, ...awbDto } = createAwbDto;

    const queryRunner = queryRunnerManager.queryRunner;

    try {
      // 2. awb를 입력하기

      // 초기 입력 시 피스수 = 전체피스수
      if (!awbDto.awbTotalPiece) awbDto.awbTotalPiece = awbDto.piece;

      const awbResult = await queryRunner.manager
        .getRepository(Awb)
        .save(awbDto);

      // scc 정보, awb이 입력되어야 동작하게끔
      if (scc && awbResult && awbResult.id) {
        // 4. 입력된 scc찾기
        const sccResult = await this.sccRepository.find({
          where: { code: In(scc) },
        });

        // 5. awb와 scc를 연결해주기 위한 작업
        const joinParam = sccResult.map((item) => {
          return {
            Awb: awbResult.id,
            Scc: item.id,
          };
        });
        await queryRunner.manager.getRepository(AwbSccJoin).save(joinParam);
        // [통합 테스트용] dt에 vms create되었다고 알려주기
        this.mqttService.sendMqttMessage(`hyundai/vms1/create`, awbResult);
      }
      // awb가 생성되었다는 것을 알려주기
      this.mqttService.sendMqttMessage(`hyundai/vms1/readCompl`, {
        fileRead: true,
      });
      return awbResult;
    } catch (error) {
      throw new TypeORMError(`rollback Working - ${error}`);
    } finally {
      // await queryRunner.release();
    }
  }

  async createList(
    createAwbDtos: CreateAwbDto[],
    queryRunnerManager: EntityManager,
  ) {
    const queryRunner = queryRunnerManager.queryRunner;

    try {
      // 초기 입력 시 피스수 = 전체피스수
      for (const awbDto of createAwbDtos) {
        if (!awbDto.awbTotalPiece) awbDto.awbTotalPiece = awbDto.piece;
      }

      const updatedAwbDtos = createAwbDtos.map((awbDto) => ({
        ...awbDto,
        awbTotalPiece: awbDto.awbTotalPiece || awbDto.piece,
      }));

      const awbResult = await queryRunner.manager
        .getRepository(Awb)
        .save(updatedAwbDtos);

      for (const awb of awbResult) {
        if (awb.scc && awb && awb.id) {
          // 4. 입력된 scc찾기
          const sccResult = await this.sccRepository.find({
            where: { code: In(awb.scc) },
          });

          // 5. awb와 scc를 연결해주기 위한 작업
          const joinParam = sccResult.map((item) => {
            return {
              Awb: awb.id,
              Scc: item.id,
            };
          });
          await queryRunner.manager.getRepository(AwbSccJoin).save(joinParam);
        }
      }

      // [통합 테스트용] dt에 vms create되었다고 알려주기
      this.mqttService.sendMqttMessage(`hyundai/vms1/create`, awbResult);
      // awb 실시간 데이터를 MQTT로 publish
      this.mqttService.sendMqttMessage(`hyundai/vms1/readCompl`, {
        fileRead: true,
      });
      return awbResult;
    } catch (error) {
      throw new TypeORMError(`rollback Working - ${error}`);
    }
  }

  async injectionScc(
    awbId: number,
    body: InjectionSccDto,
    queryRunnerManager: EntityManager,
  ) {
    const queryRunner = queryRunnerManager.queryRunner;
    try {
      if (body.Sccs && body.Sccs.length <= 0) {
        throw new NotFoundException('Sccs가 존재하지 않습니다.');
      }
      const sccList = body.Sccs;

      const sccResult = await this.awbUtilService.findSccByCodeList(sccList);

      const joinParam = this.awbUtilService.createAwbSccJoinParams(
        awbId,
        sccResult,
      );

      const joinResult = await this.awbUtilService.saveAwbSccJoin(
        queryRunner,
        joinParam,
      );

      return joinResult;
    } catch (error) {
      throw new TypeORMError(`rollback Working - ${error}`);
    }
  }

  // vms에 데이터를 넣고 awb 테이블에 데이터를 넣는 메서드(디모아측 insert를 대신 테스트 하기 위한용도)
  async createIntegrate(createAwbDto: CreateAwbDto) {
    const { scc, ...awbDto } = createAwbDto;
    const randomeString = uuidv4().split('-')[0];
    const randomAwbPiece = Math.floor(Math.random() * 1000) + 1;
    const createDate = dayjs().format('YYYYMMDDHHmmss');

    try {
      // 서버 내부적으로 body 데이터 기반으로 태스트용 디모아DB에 VMS 생성
      const createVmsDto: CreateVmsDto = {
        VWMS_ID: randomeString,
        AWB_NUMBER: awbDto.barcode,
        SEPARATION_NO: awbDto.separateNumber,
        MEASUREMENT_COUNT: 0,
        FILE_NAME: awbDto.barcode,
        FILE_PATH: process.env.NAS_PATH,
        // FILE_EXTENSION: 'fbx',
        FILE_SIZE: 0,
        RESULT_TYPE: 'C',
        WATER_VOLUME: awbDto.waterVolume,
        CUBIC_VOLUME: awbDto.squareVolume,
        WIDTH: awbDto.width,
        LENGTH: awbDto.length,
        HEIGHT: awbDto.depth,
        WEIGHT: awbDto.weight,
        CREATE_USER_ID: randomeString,
        CREATE_DATE: createDate,
      };
      const insertVmsResult = this.vmsRepository.save(createVmsDto);

      const createVms2Dto: CreateVms2dDto = {
        VWMS_ID: randomeString,
        AWB_NUMBER: awbDto.barcode,
        SEPARATION_NO: awbDto.separateNumber,
        FILE_NAME: awbDto.barcode,
        FILE_PATH: process.env.NAS_PATH_2D,
        // FILE_EXTENSION: 'png',
        FILE_SIZE: 0,
        CALIBRATION_ID: randomeString,
        CREATE_USER_ID: randomeString,
        CREATE_DATE: createDate,
      };
      const insertVms2dResult = this.vms2dRepository.save(createVms2Dto);

      // VWMV_AWB_RESULT 테이블 넣는 작업
      const createVmsAwbResult: Partial<CreateVmsAwbResultDto> = {
        VWMS_ID: randomeString,
        AWB_NUMBER: awbDto.barcode,
        SPCL_CGO_CD_INFO: scc ? scc.join(',') : null,
        CGO_TOTAL_PC: randomAwbPiece,
        // CGO_NDS: 'Y', nds 칼럼 넣기 옵션
        ALL_PART_RECEIVED: 'Y',
        RECEIVED_USER_ID: randomeString,
        RECEIVED_DATE: createDate,
      };
      const insertVmsAwbResultResult =
        this.vmsAwbResultRepository.save(createVmsAwbResult);

      // VWMV_AWB_HISTORY 테이블 넣는 작업
      const createVmsAwbHistory: Partial<CreateVmsAwbHistoryDto> = {
        VWMS_ID: randomeString,
        AWB_NUMBER: awbDto.barcode,
        SEPARATION_NO: awbDto.separateNumber,
        FLIGHT_NUMBER: randomeString,
        CGO_PC: randomAwbPiece,
        G_SKID_ON: 'Y',
        OUT_USER_ID: randomeString,
        OUT_DATE: createDate,
      };
      const insertVmsAwbHisotryResult =
        this.vmsAwbHistoryRepository.save(createVmsAwbHistory);

      const [vmsResult, vms2dResult, vmsAwbResult] = await Promise.allSettled([
        insertVmsResult,
        insertVms2dResult,
        insertVmsAwbResultResult,
        insertVmsAwbHisotryResult,
      ]);

      // 서버 내부적으로 mqtt 신호(/hyundai/vms1/createFile)을 발생,
      // 서버 내부적으로 디모아DB에 담긴 vms 파일을 읽어오기
      // 읽어온 vms 파일을 result 형태로 mqtt(hyundai/vms1/create)로 전송
      this.mqttService.sendMqttMessage(`hyundai/vms1/createFile`, {});
    } catch (error) {
      throw new TypeORMError(`rollback Working - ${error}`);
    }
  }

  // awb 입력을 할 때 다른 곳에서 트랜잭션을 같이 걸기 위해 만든 메서드
  async createWithOtherTransaction(
    createAwbDto: CreateAwbDto,
    transaction: QueryRunner = this.dataSource.createQueryRunner(),
  ) {
    const { scc, ...awbDto } = createAwbDto;

    const queryRunner = transaction;
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 2. awb를 입력하기
      const awbResult = await queryRunner.manager
        .getRepository(Awb)
        .save(awbDto);

      // scc 정보, awb이 입력되어야 동작하게끔
      if (scc && awbResult) {
        // 4. 입력된 scc찾기
        const sccResult = await this.sccRepository.find({
          where: { code: In(scc.map((s) => s.code)) },
        });

        // 5. awb와 scc를 연결해주기 위한 작업
        const joinParam = sccResult.map((item) => {
          return {
            Awb: awbResult.id,
            Scc: item.id,
          };
        });
        await queryRunner.manager.getRepository(AwbSccJoin).save(joinParam);
      }

      // 외부 트랜젝션으로 commit을 결정
      await queryRunner.commitTransaction();
      // awb 실시간 데이터를 MQTT로 publish
      this.mqttService.sendMqttMessage(`hyundai/vms1/readCompl`, {
        fileRead: true,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new TypeORMError(`rollback Working - ${error}`);
    }
    // 외부 트랜젝션으로 release를 결정
    // finally {
    //   await queryRunner.release();
    // }
  }

  // vms에서 온 데이터 중 처음은 update, 분리된 화물은 insert 하기 위한 메서드
  async createWithMssql(
    vms3D: Vms3D,
    vms2d: Vms2d,
    vmsAwbResult: VmsAwbResult,
    vmsAwbHistory: VmsAwbHistory,
  ) {
    const queryRunner = this.awbUtilService.getQueryRunner();
    await queryRunner.connect();

    try {
      let awbIdInDb: number;
      let insertedAwb: Awb = null;
      await queryRunner.startTransaction();

      // vms에서 온 데이터 세팅(실제 db에 넣을 파라미터 세팅하는 부분)
      // 모델링 파일 저장 로직도 여기서
      const awbDto = await this.awbUtilService.prepareAwbDto(
        vms3D,
        vms2d,
        vmsAwbResult,
        vmsAwbHistory,
      );

      if (!awbDto) {
        console.log(`awbDto 생성 실패 ${awbDto}`);
        return;
      }

      const existingAwb = await this.awbUtilService.findExistingAwb(
        queryRunner,
        awbDto.barcode,
        awbDto.separateNumber,
      );

      // 예약된 화물(separateNO가 1이라 가정)은 awb에 저장되어 있으니 update, 그 외에는 insert
      // null값 들어오고 update되는지, null값 들어오고 새로운 값이 insert 되는지 몰라서 안전하게 2개다 걸어둠
      if (existingAwb) {
        awbIdInDb = await this.awbUtilService.updateAwb(
          queryRunner,
          existingAwb.id,
          awbDto,
        );
      } else {
        const insertedAwb = await this.awbUtilService.insertAwb(
          queryRunner,
          awbDto,
        );
        awbIdInDb = insertedAwb.id;
        // insert되면 redis에 등록
        await this.awbUtilService.settingRedis(
          insertedAwb.barcode,
          insertedAwb.separateNumber,
        );
        // insert된 것만 mqtt로 전송
        const Awb = await this.findOne(awbIdInDb);
        await this.awbUtilService.sendMqttMessage(Awb);
      }

      // 존재하지 않을 때만 awb insert하기
      // if (!existingAwb) {
      //   insertedAwb = await this.awbUtilService.insertAwb(queryRunner, awbDto);
      //   awbIdInDb = insertedAwb.id;
      //
      //   // insert되면 redis에 등록
      //   await this.awbUtilService.settingRedis(
      //     insertedAwb.barcode,
      //     insertedAwb.separateNumber,
      //   );
      //
      //   // insert된 것만 mqtt로 전송
      //   const Awb = await this.findOne(awbIdInDb);
      //   await this.awbUtilService.sendMqttMessage(Awb);
      // }

      // scc 테이블에서 가져온 데이터를 입력
      if (vmsAwbResult && awbIdInDb) {
        await this.awbUtilService.connectAwbWithScc(
          queryRunner,
          vmsAwbResult,
          awbIdInDb,
        );
      }

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return insertedAwb;
    } catch (error) {
      await this.awbUtilService.handleError(queryRunner, error);
    } finally {
      await queryRunner.release();
    }
  }

  // 누락된 vms를 update하기 위한 로직
  async preventMissingData(vms: Vms3D, vms2d: Vms2d) {
    try {
      const createAwbDto: Partial<CreateAwbDto> = {
        barcode: vms.AWB_NUMBER,
        separateNumber: vms.SEPARATION_NO,
        modelPath: null,
        path: null,
      };

      // vms에서 nas 경로를 읽어서 파일 저장하는 부분
      if (vms && vms.FILE_PATH) {
        try {
          const filePath = await this.awbUtilService.fileUpload(vms);
          createAwbDto.modelPath = filePath;
        } catch (e) {}
      }

      // vms에서 2d 데이터 파일 저장하는 부분
      if (vms2d && vms2d.FILE_PATH) {
        try {
          const filePath = await this.awbUtilService.fileUpload2d(vms2d);
          createAwbDto.path = filePath;
        } catch (e) {}
      }
      console.log('createAwbDto = ', createAwbDto);

      await this.awbRepository.update(
        {
          barcode: createAwbDto.barcode,
          separateNumber: createAwbDto.separateNumber,
        },
        {
          modelPath: createAwbDto.modelPath,
          path: createAwbDto.path,
        },
      );
    } catch (error) {
      throw new TypeORMError(`rollback Working - ${error}`);
    }
  }

  // vms의 3d 모델링 db의 파일 경로로 파일 업로드 하는 메서드
  protected async fileUpload(vms: Vms3D) {
    const file = `Z:\\${vms.FILE_PATH}\\${vms.FILE_NAME}`;
    const fileContent = await this.fileService.readFile(file);
    const fileResult = await this.fileService.uploadFileToLocalServer(
      fileContent,
      `${vms.AWB_NUMBER}_${vms.SEPARATION_NO}_${vms.FILE_NAME}`,
    );
    return fileResult;
  }

  // vms의 2d 모델링 db의 파일 경로로 파일 업로드 하는 메서드
  protected async fileUpload2d(vms2d: Vms2d) {
    const file = `Z:\\${vms2d.FILE_PATH}\\${vms2d.FILE_NAME}`;
    const fileContent = await this.fileService.readFile(file);
    const fileResult = await this.fileService.uploadFileToLocalServer(
      fileContent,
      `${vms2d.FILE_NAME}`,
    );
    return fileResult;
  }

  async findAll(query: Awb & BasicQueryParamDto) {
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

    const searchResult = await this.awbRepository.find({
      where: {
        AirCraftSchedule: query.AirCraftSchedule
          ? Equal(+query.AirCraftSchedule)
          : undefined,
        prefab: query.prefab,
        waterVolume: query.waterVolume,
        squareVolume: query.squareVolume,
        width: query.width,
        length: query.length,
        depth: query.depth,
        weight: query.weight,
        isStructure: query.isStructure,
        barcode: query.barcode ? ILike(`%${query.barcode}%`) : undefined,
        separateNumber: query.separateNumber,
        destination: query.destination,
        source: query.source,
        breakDown: query.breakDown,
        piece: query.piece,
        state: query.state,
        parent: query.parent,
        modelPath: query.modelPath,
        path: query.path,
        spawnRatio: query.spawnRatio,
        description: query.description,
        rmComment: query.rmComment,
        localTime: query.localTime,
        localInTerminal: query.localInTerminal,
        simulation: query.simulation,
        ghost: query.ghost,
        createdAt: findDate,
      },
      order: orderByUtil(query.order),
      take: query.limit,
      skip: query.offset,
      relations: {
        Scc: true,
        // AirCraftSchedules: true,
      },
    });

    return searchResult;
  }

  // awb의 정보를 csv로 export 할 수 있는 메서드
  async printCsv(query: Awb & BasicQueryParamDto) {
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

    const searchResult = await this.awbRepository.find({
      where: {
        AirCraftSchedule: query.AirCraftSchedule
          ? Equal(+query.AirCraftSchedule)
          : undefined,
        simulation: query.simulation,
        createdAt: findDate,
      },
      order: orderByUtil(query.order),
      take: query.limit,
      skip: query.offset,
      relations: {
        Scc: true,
      },
    });

    const csvData = [];
    for (const [i, awb] of searchResult.entries()) {
      const sccString = awb.Scc.map((scc) => scc.code).join('+');
      const data = {
        id: i,
        name: awb.barcode,
        POU: awb.destination,
        width: awb.width,
        length: awb.length,
        depth: awb.depth,
        waterVolume: awb.waterVolume,
        weight: awb.weight,
        SCCs: sccString,
        state: 'saved',
        rate: '',
      };
      csvData.push(data);
    }
    const csvResult = this.fileService.jsonToCSV(csvData);
    await this.fileService.makeCsvFile(
      csvResult,
      // `${new Date().toISOString()}.csv`,
      `${dayjs().format('YYYY-MM-DD HH-mm-ss')}.csv`,
    );
    return searchResult;
  }

  // 해포 화물의 자식을 가져오기 위한 메서드
  findFamily(id: number) {
    return this.awbRepository.find({
      where: [{ parent: id }],
      relations: {
        Scc: true,
        // AirCraftSchedules: true,
      },
    });
  }

  async findOne(id: number) {
    const searchResult = await this.awbRepository.find({
      where: { id: id },
      relations: {
        Scc: true,
        AirCraftSchedule: true,
      },
    });
    return searchResult;
  }

  update(id: number, updateAwbDto: UpdateAwbDto) {
    return this.awbRepository.update(id, updateAwbDto);
  }

  // awb의 상태를 변경하는 메서드
  updateState(id: number, state: string, updateAwbDto?: UpdateAwbDto) {
    if (state) updateAwbDto.state = state;
    // this.awbRepository.update({ parent: id }, updateAwbDto);
    return this.awbRepository.update(id, updateAwbDto);
  }

  // awb들의 상태를 변경하는 메서드
  updateStateList(
    idList: number[],
    state: string,
    updateAwbDto?: UpdateAwbDto,
  ) {
    if (state) updateAwbDto.state = state;
    return this.awbRepository.update(idList, updateAwbDto);
  }

  // 부모 화물 정보 검증
  async validateParentCargo(parentId: number) {
    const parentCargo = await this.awbRepository.findOne({
      where: { id: parentId },
      relations: { AirCraftSchedule: true },
      select: { AirCraftSchedule: { id: true } },
    });

    if (
      !parentCargo ||
      parentCargo.parent !== 0 ||
      parentCargo.parent === null ||
      parentCargo.breakDown === false
    ) {
      throw new NotFoundException('상위 화물 정보가 잘못되었습니다.');
    }

    return parentCargo;
  }

  // 하위 화물 등록
  async registerSubAwb(subAwb, parentCargo, queryRunner) {
    subAwb.parent = parentCargo.id;
    subAwb.breakDown = true;
    subAwb.AirCraftSchedule = parentCargo.AirCraftSchedule;
    subAwb.state = 'inskidplatform';
    subAwb.separateNumber = parentCargo.separateNumber; // 고스트 화물은 부모화물의 seperateNumber랑 같아야 됨

    if ('id' in subAwb) {
      delete subAwb.id;
    }

    return await queryRunner.manager.getRepository(Awb).save(subAwb);
  }

  // awb와 scc 연결
  async joinAwbScc(sccResult, awbResult, queryRunner) {
    const joinParam = sccResult.map((item) => {
      return {
        Awb: awbResult.id,
        Scc: item.id,
      };
    });

    await this.awbUtilService.saveAwbSccJoin(queryRunner, joinParam);
  }

  // 해포
  async breakDown(
    parentId: number,
    createAwbDtos: CreateAwbDto[] | breakDownAwb[],
    queryRunnerManager: EntityManager,
  ) {
    const parentCargo = await this.validateParentCargo(parentId);

    const queryRunner = queryRunnerManager.queryRunner;

    try {
      for (let i = 0; i < createAwbDtos.length; i++) {
        const subAwb = createAwbDtos[i];
        const awbResult = await this.registerSubAwb(
          subAwb,
          parentCargo,
          queryRunner,
        );
        if (awbResult && awbResult.scc && awbResult.id) {
          const sccResult = await this.awbUtilService.findScc(awbResult);
          await this.joinAwbScc(sccResult, awbResult, queryRunner);
        }
      }

      await this.awbUtilService.changeParentCargoStatus(parentId, queryRunner);
    } catch (error) {
      throw new TypeORMError(`rollback Working - ${error}`);
    }
  }

  // ps에 해포 보내기
  async breakDownForPs(
    prepareBreakDownAwbDto: PrepareBreakDownAwbInputDto,
    queryRunnerManager: EntityManager,
  ) {
    // 사용자의 입력으로 awbTotalPiece 를 piece로 수정하게 함
    // 사용자가 봤을 때 화물의 개수가 달라질 수 있으므로
    await this.awbUtilService.updatePiece(
      queryRunnerManager.queryRunner,
      prepareBreakDownAwbDto.id,
      prepareBreakDownAwbDto.awbTotalPiece,
    );

    const psResult = await breakDownRequest(prepareBreakDownAwbDto);

    if (!psResult.result) {
      throw new HttpException('ps에서 정보를 가져오지 못했습니다', 400);
    }

    await this.breakDown(
      psResult.result[0].id,
      psResult.result,
      queryRunnerManager,
    );

    if (!prepareBreakDownAwbDto?.SkidPlatform) {
      return;
    }
    const createSkidPlatformHistoryDto: CreateSkidPlatformHistoryDto = {
      inOutType: 'in',
      SkidPlatform: prepareBreakDownAwbDto?.SkidPlatform,
      Awb: prepareBreakDownAwbDto.id,
      count: prepareBreakDownAwbDto.awbTotalPiece,
      totalCount: prepareBreakDownAwbDto.awbTotalPiece,
    };
    await this.skidPlatformHistoryService.create(createSkidPlatformHistoryDto);
  }

  remove(id: number) {
    return this.awbRepository.delete(id);
  }

  // 서버에 업로된 파일 경로를 db에 연결하는 메서드
  async modelingCompleteById(id: number, file: Express.Multer.File) {
    try {
      // parameter에 있는 Awb 정보에 모델링파일을 연결합니다.
      await this.awbRepository.update(id, { modelPath: file.path });
    } catch (e) {
      console.error(e);
    }
  }

  // vms데이터를 받았다는 신호를 전송하는 메서드
  async sendModelingCompleteMqttMessage() {
    // awb실시간 데이터 mqtt로 publish 하기 위함
    this.mqttService.sendMqttMessage(`hyundai/vms1/readCompl`, {
      fileRead: true,
    });
    // const awb = await this.getLastAwb();
    // vwms_history 기준으로 최신 awb를 보내기 위함
    const awb = await this.getLastAwbByReceivedDate();
    this.mqttService.sendMqttMessage(`hyundai/vms1/awb`, awb);
  }

  // vms데이터를 받았다는 신호를 전송하는 메서드
  async sendSyncMqttMessage(awb: Awb) {
    // awb실시간 데이터 mqtt로 publish 하기 위함
    this.mqttService.sendMqttMessage(`hyundai/vms1/readCompl`, {
      fileRead: true,
    });
    this.mqttService.sendMqttMessage(`hyundai/vms1/awb`, awb);
  }

  // 모델링 파일이 없는 화물을 검색하는 메서드
  async getAwbNotCombineModelPath(limitNumber: number) {
    return await this.awbRepository.find({
      where: [
        { modelPath: IsNull() }, // modelPath가 null인 경우
        // { path: IsNull() },
        { simulation: false },
      ],
      order: orderByUtil(null),
      take: limitNumber,
    });
  }

  // vms3D에서 개수만큼 꺼내오는 메서드
  async getAwbByVms(takeNumber: number) {
    const [result] = await this.vmsRepository.find({
      order: orderByUtil('-CREATE_DATE'),
      take: takeNumber,
    });
    return result;
  }

  // vms3D에서 이름으로 찾아오는 메서드
  async getAwbByVmsByName(name: string, separateNumber: number) {
    const [result] = await this.vmsRepository.find({
      order: orderByUtil('-CREATE_DATE'),
      where: { AWB_NUMBER: name, SEPARATION_NO: separateNumber },
    });
    return result;
  }

  // vms2d에서 개수만큼 찾아오는 메서드
  async getAwbByVms2d(takeNumber: number) {
    const [result] = await this.vms2dRepository.find({
      order: orderByUtil('-CREATE_DATE'),
      take: takeNumber,
    });
    return result;
  }

  // vms2에서 이름으로 찾아오는 메서드
  async getAwbByVms2dByName(name: string, separateNumber: number) {
    const [result] = await this.vms2dRepository.find({
      order: orderByUtil('-CREATE_DATE'),
      where: { AWB_NUMBER: name, SEPARATION_NO: separateNumber },
    });
    return result;
  }

  // 최신 awb를 꺼내오는 매서드
  async getLastAwb() {
    const [awbResult] = await this.awbRepository.find({
      order: orderByUtil(null),
      take: 1,
    });
    return awbResult;
  }

  // 최신 awb를 꺼내오는 매서드
  async getLastAwbByReceivedDate() {
    const [awbResult] = await this.awbRepository.find({
      where: {
        receivedDate: Not(IsNull()),
      },
      order: orderByUtil('-receivedDate'),
      take: 1,
    });
    return awbResult;
  }

  // awbNumber로 VWMS_AWB_RESULT 테이블에 있는 정보 가져오기
  async getVmsByAwbNumber(name: string) {
    const [result] = await this.vmsAwbResultRepository.find({
      order: orderByUtil('-RECEIVED_DATE'),
      where: { AWB_NUMBER: name },
    });
    return result;
  }

  // awbNumber로 VWMS_AWB_HISTORY 테이블에 있는 정보 가져오기
  async getLastAwbByAwbNumber(name: string) {
    try {
      const [result] = await this.vmsAwbHistoryRepository.find({
        order: orderByUtil('-IN_DATE'),
        where: { AWB_NUMBER: name },
      });
      return result;
    } catch (e) {
      console.error(e);
    }
  }

  // 최신 VWMS_AWB_RESULT 테이블에 있는 정보 가져오기
  async getLastVmsAwbResult(barcode: string) {
    const [result] = await this.vmsAwbResultRepository.find({
      where: {
        AWB_NUMBER: Equal(barcode),
      },
      order: orderByUtil('-RECEIVED_DATE'),
      take: 1,
    });
    return result;
  }

  // 최신 VWMS_AWB_HISTORY 테이블에 있는 정보 가져오기
  async getLastVmsAwbHistory() {
    const [result] = await this.vmsAwbHistoryRepository.find({
      order: orderByUtil('-IN_DATE'),
      take: 1,
    });
    return result;
  }

  // VWMS_AWB_HISTORY 테이블에 있는 정보 100 가져오기
  async get100VmsAwbHistory() {
    const result = await this.vmsAwbHistoryRepository.find({
      where: {
        RESULT_LENGTH: Not(IsNull()),
      },
      order: orderByUtil('-IN_DATE'),
      take: 1,
    });
    return result;
  }

  // VWMS_AWB_HISTORY 테이블에 있는 정보 barcode, separateNumber로 정보 가져오기
  async getVmsAwbHistoryByBarcodeAndSeparateNumber(
    barcode: string,
    separateNumber: number,
  ) {
    const [result] = await this.vmsAwbHistoryRepository.find({
      where: {
        RESULT_LENGTH: Not(IsNull()),
        AWB_NUMBER: barcode.toString(),
        SEPARATION_NO: separateNumber,
      },
      order: orderByUtil('-IN_DATE'),
      take: 1,
    });
    return result;
  }

  // awb의 scc만 가져오는 메서드
  async getScc(awbId: number) {
    const queryRunner = this.awbUtilService.getQueryRunner();
    const searchResult = await this.awbUtilService.findSccInAwb(
      queryRunner,
      awbId,
    );
    return searchResult;
  }

  // vms에서 mqtt로 awb 정보왔을 때 사용하는 메서드
  async createAwbByPlcMqtt(data) {
    // 현재 들어오는 데이터 확인하기
    const currentBarcode = data['VMS_08_01_P2A_Bill_No'];
    const currentSeparateNumber = data['VMS_08_01_P2A_SEPARATION_NO'];

    if (!currentBarcode || !currentSeparateNumber) {
      throw new NotFoundException(
        'VMS_08_01_P2A_Bill_No, VMS_08_01_P2A_SEPARATION_NO 데이터가 없습니다.',
      );
    }

    // redis에 있는 값 가져오기
    const previousBarcode = await this.awbUtilService.getBarcode();
    const previousSeparateNumber =
      +(await this.awbUtilService.getSeparateNumber());

    const firstTime =
      previousBarcode === null && previousSeparateNumber === null;

    // 비교하기
    // 같다면 return
    // if (
    //   !firstTime &&
    //   currentBarcode === previousBarcode &&
    //   currentSeparateNumber === previousSeparateNumber
    // ) {
    //   return;
    // }

    // 다르다면 로직 시작
    // history 값 가져오기
    try {
      // vms 체적 데이터 가져오기
      const vmsAwbHistoryData =
        await this.fetchVmsAwbHistoryByBarcodeAndSeparateNumber(
          currentBarcode,
          currentSeparateNumber,
        );

      if (!vmsAwbHistoryData) {
        throw new NotFoundException(
          `vmsAwbHistory 테이블에 데이터가 없습니다. in awb.service${currentBarcode}, ${currentSeparateNumber}`,
        );
      }

      // bill_No으로 vmsAwbResult 테이블의 값 가져오기 위함(기존에는 최상단의 vms를 가져옴)
      const vmsAwbResult = await this.getLastVmsAwbResult(
        vmsAwbHistoryData.AWB_NUMBER,
      );

      // vms 모델 데이터 가져오기
      const vms3Ddata = await this.getAwbByVmsByName(
        vmsAwbHistoryData.AWB_NUMBER,
        vmsAwbHistoryData.SEPARATION_NO,
      );
      const vms2dData = await this.getAwbByVms2dByName(
        vmsAwbHistoryData.AWB_NUMBER,
        vmsAwbHistoryData.SEPARATION_NO,
      );

      // 가져온 데이터를 조합해서 db에 insert 로직 호출하기
      // 체적이 null이라면 return
      // 체적이 있다면 insert 하기
      const awb = await this.createWithMssql(
        vms3Ddata,
        vms2dData,
        vmsAwbResult,
        vmsAwbHistoryData,
      );

      // awb 생성되지 않았다면 null 반환
      if (!awb) {
        console.log('vms에서 awb가 생성되지 않았습니다.');
        return null;
      }

      // 화물이 입력이 되면 입력된 바코드, separateNumber 저장
      // insert 되면 redis의 값 수정
      await this.awbUtilService.settingRedis(awb.barcode, awb.separateNumber);
      // mqtt 메세지 보내기 로직 호출
      await this.sendSyncMqttMessage(awb);
      console.log('vms 동기화 완료');
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // asrs에서 mqtt로 awb 정보왔을 때 사용하는 매서드
  async createAwbByPlcMqttUsingAsrsAndSkidPlatform(
    barcode: string,
    separateNumber: number,
  ) {
    // 현재 들어오는 데이터 확인하기
    const currentBarcode = barcode;
    const currentSeparateNumber = separateNumber;

    // console.log('currentBarcode = ', currentBarcode);
    // console.log('currentSeparateNumber = ', currentSeparateNumber);
    if (!currentBarcode || !currentSeparateNumber) {
      // throw new NotFoundException('barcode, separateNumber 데이터가 없습니다.');
      // console.log('barcode, separateNumber 데이터가 없습니다.');
      return null;
    }

    // history 값 가져오기
    try {
      // vms 체적 데이터 가져오기
      const vmsAwbHistoryData =
        await this.fetchVmsAwbHistoryByBarcodeAndSeparateNumber(
          currentBarcode,
          +currentSeparateNumber,
        );

      if (!vmsAwbHistoryData) {
        // console.log('vmsAwbHistory 테이블에 데이터가 없습니다.');
        return null;
        // throw new NotFoundException('vmsAwbHistory 테이블에 데이터가 없습니다.');
      }

      // bill_No으로 vmsAwbResult 테이블의 값 가져오기 위함(기존에는 최상단의 vms를 가져옴)
      const vmsAwbResult = await this.getLastVmsAwbResult(
        vmsAwbHistoryData.AWB_NUMBER,
      );

      // vms 모델 데이터 가져오기
      const vms3Ddata = await this.getAwbByVmsByName(
        vmsAwbHistoryData.AWB_NUMBER,
        vmsAwbHistoryData.SEPARATION_NO,
      );
      const vms2dData = await this.getAwbByVms2dByName(
        vmsAwbHistoryData.AWB_NUMBER,
        vmsAwbHistoryData.SEPARATION_NO,
      );

      // 가져온 데이터를 조합해서 db에 insert 로직 호출하기
      // 체적이 null이라면 return
      // 체적이 있다면 insert 하기
      const awb = await this.createWithMssql(
        vms3Ddata,
        vms2dData,
        vmsAwbResult,
        vmsAwbHistoryData,
      );

      // 화물이 입력이 되면 입력된 바코드, separateNumber 저장
      // insert 되면 redis의 값 수정
      if (awb) {
        // mqtt 메세지 보내기 로직 호출
        await this.sendSyncMqttMessage(awb);
      }

      console.log('asrs에서 vms 데이터 생성');
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // VWMS_AWB_HISTORY 테이블에 있는 정보 barcode, separateNumber로 정보 가져오기
  private async fetchVmsAwbHistoryByBarcodeAndSeparateNumber(
    barcode: string,
    separateNumber: number,
  ) {
    return await this.getVmsAwbHistoryByBarcodeAndSeparateNumber(
      barcode,
      separateNumber,
    );
  }
}
