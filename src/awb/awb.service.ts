import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAwbDto } from './dto/create-awb.dto';
import { UpdateAwbDto } from './dto/update-awb.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  DataSource,
  EntityManager,
  FindOperator,
  ILike,
  In,
  IsNull,
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
import { Aircraft } from '../aircraft/entities/aircraft.entity';
import { CreateAircraftDto } from '../aircraft/dto/create-aircraft.dto';
import { CreateAircraftScheduleDto } from '../aircraft-schedule/dto/create-aircraft-schedule.dto';
import { AircraftSchedule } from '../aircraft-schedule/entities/aircraft-schedule.entity';
import { CreateAwbBreakDownDto } from './dto/create-awb-break-down.dto';
import { FileService } from '../file/file.service';
import { Vms } from '../vms/entities/vms.entity';
import { CreateAwbWithAircraftDto } from '../awb/dto/create-awb-with-aircraft.dto';
import { MqttService } from '../mqtt.service';
import { SccService } from '../scc/scc.service';
import { Vms2d } from '../vms2d/entities/vms2d.entity';
import { CreateVmsDto } from '../vms/dto/create-vms.dto';
import { CreateVms2dDto } from '../vms2d/dto/create-vms2d.dto';
import { HttpExceptionFilter } from '../lib/filter/httpExceptionFilter';
import { AwbUtilService } from './awbUtil.service';
import { InjectionSccDto } from './dto/injection-scc.dto';

@Injectable()
export class AwbService {
  constructor(
    @InjectRepository(Awb)
    private readonly awbRepository: Repository<Awb>,
    @InjectRepository(Scc)
    private readonly sccRepository: Repository<Scc>,
    @InjectRepository(Vms, 'mssqlDB')
    private readonly vmsRepository: Repository<Vms>,
    @InjectRepository(Vms2d, 'mssqlDB')
    private readonly vms2dRepository: Repository<Vms2d>,
    private dataSource: DataSource,
    private readonly fileService: FileService,
    private readonly mqttService: MqttService,
    private readonly sccService: SccService,
    private readonly awbUtilService: AwbUtilService,
  ) {}

  async create(createAwbDto: CreateAwbDto, queryRunnerManager: EntityManager) {
    const { scc, ...awbDto } = createAwbDto;

    const queryRunner = queryRunnerManager.queryRunner;

    try {
      // 2. awb를 입력하기
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
      const awbResult = await queryRunner.manager
        .getRepository(Awb)
        .save(createAwbDtos);

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

  async createIntegrate(createAwbDto: CreateAwbDto) {
    const { scc, ...awbDto } = createAwbDto;

    try {
      // 서버 내부적으로 body 데이터 기반으로 태스트용 디모아DB에 VMS 생성
      const createVmsDto: CreateVmsDto = {
        AWB_NUMBER: awbDto.barcode,
        SEPARATION_NO: awbDto.separateNumber,
        MEASUREMENT_COUNT: 0,
        FILE_NAME: awbDto.barcode,
        VWMS_ID: '',
        FILE_PATH: process.env.NAS_PATH,
        FILE_EXTENSION: 'fbx',
        FILE_SIZE: 0,
        RESULT_TYPE: 'C',
        waterVolume: awbDto.waterVolume,
        WIDTH: awbDto.width,
        LENGTH: awbDto.length,
        HEIGHT: awbDto.depth,
        WEIGHT: awbDto.weight,
        Sccs: scc.join(','),
      };
      const insertVmsResult = this.vmsRepository.save(createVmsDto);
      const createVms2Dto: CreateVms2dDto = {
        name: awbDto.barcode,
        FILE_NAME: awbDto.barcode,
        modelPath: process.env.NAS_PATH_2D,
        FILE_EXTENSION: 'png',
        FILE_SIZE: 0,
        CREATE_USER_ID: '',
      };
      const insertVms2dResult = this.vms2dRepository.save(createVms2Dto);

      const [vmsResult, vms2dResult] = await Promise.allSettled([
        insertVmsResult,
        insertVms2dResult,
      ]);

      // 서버 내부적으로 mqtt 신호(/hyundai/vms1/createFile)을 발생,
      // 서버 내부적으로 디모아DB에 담긴 vms 파일을 읽어오기
      // 읽어온 vms 파일을 result 형태로 mqtt(hyundai/vms1/create)로 전송
      await this.mqttService.sendMqttMessage(`hyundai/vms1/createFile1`, {});
    } catch (error) {
      throw new TypeORMError(`rollback Working - ${error}`);
    }
  }

  async createWithAircraft(
    createAwbDto: CreateAwbWithAircraftDto,
    transaction: QueryRunner = this.dataSource.createQueryRunner(),
  ) {
    const { scc, ...awbDto } = createAwbDto;

    const queryRunner = transaction;
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. aircraft 입력하기 있다면 update
      const aircraftBody: CreateAircraftDto = {
        name: createAwbDto.aircraftName,
        code: createAwbDto.aircraftCode,
        info: createAwbDto.aircraftInfo,
        allow: createAwbDto.allow,
        allowDryIce: createAwbDto.allowDryIce,
      };
      const aircraftResult = await queryRunner.manager
        .getRepository(Aircraft)
        .save(aircraftBody);

      // 3. aircraftSchedule 입력하기
      const aircraftScheduleBody: CreateAircraftScheduleDto = {
        code: createAwbDto.aircraftCode,
        source: createAwbDto.source,
        localDepartureTime: createAwbDto.localDepartureTime,
        koreaArrivalTime: createAwbDto.koreaArrivalTime,
        workStartTime: createAwbDto.workStartTime,
        workCompleteTargetTime: createAwbDto.workCompleteTargetTime,
        koreaDepartureTime: createAwbDto.koreaDepartureTime,
        localArrivalTime: createAwbDto.localArrivalTime,
        waypoint: createAwbDto.waypoint,
        Aircraft: aircraftResult.id,
        departure: createAwbDto.departure,
        destination: createAwbDto.destination,
      };
      const aircraftScheduleResult = await queryRunner.manager
        .getRepository(AircraftSchedule)
        .save(aircraftScheduleBody);

      // 화물이 어떤 항공편으로 왔는지 추적하는 작업
      awbDto.AirCraftSchedule = aircraftScheduleResult.id;
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

      await queryRunner.commitTransaction();
      // awb 실시간 데이터를 MQTT로 publish
      this.mqttService.sendMqttMessage(`hyundai/vms1/readCompl`, {
        fileRead: true,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new TypeORMError(`rollback Working - ${error}`);
    } finally {
      await queryRunner.release();
    }
  }

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

  /**
   * mssql에서 vms 정보를 가져와서 등록하기 위한 로직
   */
  async createWithMssql(vms: Vms, vms2d: Vms2d) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();

      const createAwbDto: Partial<CreateAwbDto> = {
        barcode: vms.AWB_NUMBER,
        width: vms.WIDTH,
        length: vms.LENGTH,
        depth: vms.HEIGHT,
        weight: vms.WEIGHT,
        state: 'invms',
      };

      // vms에서 nas 경로를 읽어서 파일 저장하는 부분
      if (vms && vms.FILE_PATH) {
        try {
          const filePath = await this.fileUpload(vms);
          createAwbDto.modelPath = filePath;
        } catch (error) {
          // throw new NotFoundException(error); 파일이 없더라도 화물 생성되게
        }
      }

      // vms에서 png 파일을 저장하고 연결하는 부분
      if (vms2d && vms2d.FILE_PATH) {
        try {
          const filePath2d = await this.fileUpload2d(vms2d);
          createAwbDto.path = filePath2d;
        } catch (error) {
          // throw new NotFoundException(error); 파일이 없더라도 화물 생성되게
        }
      }

      const awbResult = await queryRunner.manager
        .getRepository(Awb)
        .save(createAwbDto);

      if (vms.Sccs && awbResult) {
        const sccResult = await this.sccService.findByNames(
          vms.Sccs.split(','),
        );
        // 5. awb와 scc를 연결해주기 위한 작업
        const joinParam = sccResult.map((item) => {
          return {
            Awb: awbResult.id,
            Scc: item.id,
          };
        });
        await queryRunner.manager.getRepository(AwbSccJoin).save(joinParam);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new TypeORMError(`rollback Working - ${error}`);
    } finally {
      await queryRunner.release();
    }
  }

  async createWithMssql2(vms: Vms, vms2d: Vms2d) {
    const queryRunner = this.awbUtilService.getQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();

      // vms에서 온 데이터 세팅
      const awbDto = await this.awbUtilService.prepareAwbDto(vms, vms2d);
      const existingAwb = await this.awbUtilService.findExistingAwb(
        queryRunner,
        awbDto.barcode,
      );

      // 예약된 화물(separateNO가 0이라 가정)은 awb에 저장되어 있으니 update, 그 외에는 insert
      if (existingAwb && vms.SEPARATION_NO === 0) {
        await this.awbUtilService.updateAwb(
          queryRunner,
          existingAwb.id,
          awbDto,
        );
      } else {
        await this.awbUtilService.insertAwb(queryRunner, awbDto);
      }

      if (vms.Sccs && existingAwb) {
        await this.awbUtilService.connectAwbWithScc(
          queryRunner,
          vms,
          existingAwb,
        );
        await this.awbUtilService.sendMqttMessage(existingAwb);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await this.awbUtilService.handleError(queryRunner, error);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 누락된 vms를 update하기 위한 로직
   */
  async preventMissingData(vms: Vms, vms2d: Vms2d) {
    try {
      const createAwbDto: Partial<CreateAwbDto> = {
        barcode: vms.AWB_NUMBER,
        modelPath: vms.FILE_PATH,
        path: vms2d.FILE_PATH,
      };

      // vms에서 nas 경로를 읽어서 파일 저장하는 부분
      if (createAwbDto.modelPath) {
        try {
          const filePath = await this.fileUpload(vms);
          createAwbDto.modelPath = filePath;
        } catch (e) {}
      }

      // vms에서 2d 데이터 파일 저장하는 부분
      if (createAwbDto.path) {
        try {
          const filePath = await this.fileUpload2d(vms2d);
          createAwbDto.path = filePath;
        } catch (e) {}
      }

      await this.awbRepository.update(
        { barcode: createAwbDto.barcode },
        createAwbDto,
      );
    } catch (error) {
      throw new TypeORMError(`rollback Working - ${error}`);
    }
  }

  protected async fileUpload(vms: Vms) {
    const file = `${vms.FILE_PATH}/${vms.FILE_NAME}.${vms.FILE_EXTENSION}`;
    const fileContent = await this.fileService.readFile(file);
    const fileResult = await this.fileService.uploadFileToLocalServer(
      fileContent,
      `${vms.FILE_NAME}.${vms.FILE_EXTENSION}`,
    );
    return fileResult;
  }

  protected async fileUpload2d(vms2d: Vms2d) {
    const file = `${vms2d.FILE_PATH}/${vms2d.FILE_NAME}.${vms2d.FILE_EXTENSION}`;
    const fileContent = await this.fileService.readFile(file);
    const fileResult = await this.fileService.uploadFileToLocalServer(
      fileContent,
      `${vms2d.FILE_NAME}.${vms2d.FILE_EXTENSION}`,
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

  findFamily(id: number) {
    return this.awbRepository.find({
      where: [{ id: id }, { parent: id }],
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

  updateState(id: number, state: string, updateAwbDto?: UpdateAwbDto) {
    if (state) updateAwbDto.state = state;
    this.awbRepository.update({ parent: id }, updateAwbDto);
    return this.awbRepository.update(id, updateAwbDto);
  }

  async breakDown(
    parentName: string,
    createAwbDtos: CreateAwbDto[],
    queryRunnerManager: EntityManager,
  ) {
    const parentCargo = await this.awbRepository.findOne({
      where: { barcode: parentName },
    });
    // 1. 부모의 존재, 부모의 parent 칼럼이 0인지, 해포여부가 false인지 확인
    if (
      !parentCargo &&
      parentCargo.parent !== 0 &&
      parentCargo.breakDown === false
    ) {
      throw new NotFoundException('상위 화물 정보가 잘못되었습니다.');
    }

    const queryRunner = queryRunnerManager.queryRunner;
    try {
      // 2. 해포된 화물들 등록
      for (let i = 0; i < createAwbDtos.length; i++) {
        // 2-1. 하위 화물 등록
        const subAwb = createAwbDtos[i];
        subAwb.parent = parentCargo.id;

        const awbResult = await queryRunner.manager
          .getRepository(Awb)
          .save(subAwb);

        const sccResult = await queryRunner.manager
          .getRepository(Scc)
          .upsert(subAwb.scc, ['name']);

        // awb와 scc를 연결해주기 위한 작업
        const joinParam = sccResult.identifiers.map((item) => {
          return {
            Awb: awbResult.id,
            Scc: item.id,
          };
        });

        // 2-2. Scc join에 등록
        await queryRunner.manager.getRepository(AwbSccJoin).save(joinParam);
      }

      // 2-3. 부모 화물 breakDown: True로 상태 변경
      await queryRunner.manager
        .getRepository(Awb)
        .update({ barcode: parentName }, { breakDown: true });
    } catch (error) {
      throw new TypeORMError(`rollback Working - ${error}`);
    }
  }

  async breakDownById(
    awbId: number,
    body: CreateAwbBreakDownDto,
    queryRunnerManager: EntityManager,
  ) {
    try {
      const parentAwb = await this.awbRepository.findOneBy({
        id: awbId,
      });
      // 1. 부모의 존재, 부모의 parent 칼럼이 0인지, 해포여부가 false인지 확인
      if (
        !parentAwb &&
        parentAwb.parent !== 0 &&
        parentAwb.breakDown === false
      ) {
        throw new NotFoundException('상위 화물 정보가 잘못되었습니다.');
      }
    } catch (e) {
      throw new NotFoundException(`${e}`);
    }

    const queryRunner = queryRunnerManager.queryRunner;

    try {
      // 2. 해포된 화물들 등록
      for (let i = 0; i < body.awbs.length; i++) {
        // 2-1. 하위 화물 등록
        const subAwb = body.awbs[i];

        await queryRunner.manager
          .getRepository(Awb)
          .update({ id: subAwb }, { parent: awbId, breakDown: true });
      }

      // 2-3. 부모 화물 breakDown: True로 상태 변경
      await queryRunner.manager
        .getRepository(Awb)
        .update({ id: awbId }, { breakDown: true });
    } catch (error) {
      throw new TypeORMError(`rollback Working - ${error}`);
    }
  }

  remove(id: number) {
    return this.awbRepository.delete(id);
  }

  async modelingCompleteById(id: number, file: Express.Multer.File) {
    try {
      // parameter에 있는 Awb 정보에 모델링파일을 연결합니다.
      await this.awbRepository.update(id, { modelPath: file.path });
    } catch (e) {
      console.error(e);
    }
  }

  async sendModelingCompleteMqttMessage() {
    // vms데이터를 받았다는 신호를전송합니다
    // awb실시간 데이터 mqtt로 publish 하기 위함
    this.mqttService.sendMqttMessage(`hyundai/vms1/readCompl`, {
      fileRead: true,
    });
    const awb = await this.getLastAwb();
    this.mqttService.sendMqttMessage(`hyundai/vms1/awb`, awb);
  }

  async getAwbNotCombineModelPath() {
    return await this.awbRepository.find({
      where: [
        { modelPath: IsNull() }, // modelPath가 null인 경우
        // { path: IsNull() },
      ],
      order: { id: 'desc' },
    });
  }

  async getAwbByVms(takeNumber: number) {
    const [result] = await this.vmsRepository.find({
      order: orderByUtil(null),
      take: takeNumber,
    });
    return result;
  }

  async getAwbByVmsByName(name: string) {
    const [result] = await this.vmsRepository.find({
      order: orderByUtil(null),
      where: { AWB_NUMBER: name },
    });
    return result;
  }

  async getAwbByVms2d(takeNumber: number) {
    const [result] = await this.vms2dRepository.find({
      order: orderByUtil(null),
      take: takeNumber,
    });
    return result;
  }

  async getAwbByVms2dByName(name: string) {
    const [result] = await this.vms2dRepository.find({
      order: orderByUtil(null),
      where: { AWB_NUMBER: name },
    });
    return result;
  }

  async getLastAwb() {
    const [awbResult] = await this.awbRepository.find({
      order: orderByUtil(null),
      take: 1,
    });
    return awbResult;
  }

  /**
   * 엣지에서 보내주는 vms 데이터 중 누락된 데이터를 다시 저장하기 위한 로직
   * @param vmsMissCount edge에서 보내주는 지금까지 보내준 vms의 총 개수
   */
  // async preventMissingData(vmsMissCount: number) {
  //   try {
  //     // vms와의 차이를 구하기 위해 awb의 총 개수를 구하기
  //     // const awbAllCount = await this.awbRepository.count();
  //
  //     // 만약 엣지에서 들어온 숫자와 vms의 전체 숫자가 같지 않으면
  //     // if (vmsMissCount !== awbAllCount) {
  //     const awbResult = await this.awbRepository.find({
  //       order: orderByUtil(null),
  //       take: 100 * Math.abs(vmsMissCount), // awb테이블의 최소한만 가져오려고 함(개수차이*100)
  //       // skip: 100 * i,
  //     });
  //     // 1 ~ 100 / 101 ~ 200 / 201 ~ 300 ... 누락된 데이터를 찾음
  //     for (let i = 0; i <= Math.floor(vmsMissCount / 100); i++) {
  //       const vmsResult = await this.vmsRepository.find({
  //         order: orderByUtil(null),
  //         take: 100,
  //         skip: 100 * i,
  //       });
  //       // 누락된 데이터찾기 & 누락되었다면 입력
  //       for (const vms of vmsResult) {
  //         const existVms = awbResult.find((awb) => awb.barcode === vms.name);
  //         if (!existVms && vms.Sccs) {
  //           // vms가 존재하고 Sccs가 존재한다면 vms에 등록된 scc 정보 찾기
  //           const sccResult = await this.sccRepository.find({
  //             where: { code: In(vms.Sccs.split(',')) },
  //           });
  //
  //           // awb 등록하는 부분
  //           const createAwbDto: Partial<CreateAwbDto> = {
  //             barcode: vms.name,
  //             waterVolume: vms.waterVolume,
  //             width: vms.width,
  //             length: vms.length,
  //             depth: vms.depth,
  //             weight: vms.weight,
  //             state: 'saved',
  //             modelPath: vms.modelPath,
  //             scc: sccResult,
  //           };
  //
  //           await this.awbRepository.create(createAwbDto);
  //         }
  //       }
  //     }
  //     // }
  //   } catch (e) {
  //     throw new TypeORMError(`rollback Working - ${e}`);
  //   }
  // }
}
