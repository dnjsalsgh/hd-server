import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAwbDto } from './dto/create-awb.dto';
import { UpdateAwbDto } from './dto/update-awb.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  DataSource,
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
import { ClientProxy } from '@nestjs/microservices';
import { take } from 'rxjs';
import { Aircraft } from '../aircraft/entities/aircraft.entity';
import { CreateAircraftDto } from '../aircraft/dto/create-aircraft.dto';
import { CreateAircraftScheduleDto } from '../aircraft-schedule/dto/create-aircraft-schedule.dto';
import { CommonCode } from '../common-code/entities/common-code.entity';
import { AircraftSchedule } from '../aircraft-schedule/entities/aircraft-schedule.entity';
import { CreateAwbBreakDownDto } from './dto/create-awb-break-down.dto';
import { FileService } from '../file/file.service';
import { Vms } from '../vms/entities/vms.entity';
import { CreateAwbWithAircraftDto } from '../awb/dto/create-awb-with-aircraft.dto';

@Injectable()
export class AwbService {
  constructor(
    @InjectRepository(Awb)
    private readonly awbRepository: Repository<Awb>,
    @InjectRepository(Scc)
    private readonly sccRepository: Repository<Scc>,
    private dataSource: DataSource,
    @Inject('MQTT_SERVICE') private client: ClientProxy,
    private readonly fileService: FileService,
    @InjectRepository(Vms, 'mssqlDB')
    private readonly vmsRepository: Repository<Vms>,
  ) {}

  async create(
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
        .upsert(awbDto, ['barcode']);

      // scc 정보, awb이 입력되어야 동작하게끔
      if (scc && awbResult.identifiers) {
        // 4. 입력된 scc찾기
        const sccResult = await this.sccRepository.find({
          where: { code: In(scc) },
        });

        // 5. awb와 scc를 연결해주기 위한 작업
        const joinParam = sccResult.map((item) => {
          return {
            Awb: awbResult.identifiers[0].id,
            Scc: item.id,
          };
        });
        await queryRunner.manager.getRepository(AwbSccJoin).save(joinParam);
      }

      await queryRunner.commitTransaction();
      // awb실시간 데이터 mqtt로 publish 하기 위함
      this.client
        .send(`hyundai/vms1/readCompl`, {
          fileRead: true,
        })
        .pipe(take(1))
        .subscribe();

      // [통합 테스트용] dt에 vms create되었다고 알려주기
      this.client
        .send(
          `hyundai/vms1/create`,
          await this.awbRepository.findOne({
            where: { id: awbResult.identifiers[0].id },
          }),
        )
        .pipe(take(1))
        .subscribe();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new TypeORMError(`rollback Working - ${error}`);
    } finally {
      await queryRunner.release();
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
      // awb실시간 데이터 mqtt로 publish 하기 위함
      this.client
        .send(`hyundai/vms1/readCompl`, {
          fileRead: true,
        })
        .pipe(take(1))
        .subscribe();
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
      // awb실시간 데이터 mqtt로 publish 하기 위함
      this.client
        .send(`hyundai/vms1/readCompl`, {
          fileRead: true,
        })
        .pipe(take(1))
        .subscribe();
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
  async createWithMssql() {
    // vms와의 차이를 구하기 위해 awb의 총 개수를 구하기
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    const vmsResult = await this.vmsRepository.find({
      order: orderByUtil(null),
      take: 10, // mssql에서 30개만 가져옴
      // skip: 100 * i,
    });
    // 누락된 데이터찾기 & 누락되었다면 입력
    try {
      for (const vms of vmsResult) {
        await queryRunner.startTransaction();
        // vms에 등록된 scc 정보 찾기

        // awb 등록하는 부분
        const createAwbDto: Partial<CreateAwbDto> = {
          barcode: vms.name,
          waterVolume: vms.waterVolume,
          width: vms.width,
          length: vms.length,
          depth: vms.depth,
          weight: vms.weight,
          state: 'saved',
          modelPath: vms.modelPath,
          // scc: sccResult,
        };

        // 2. awb를 입력하기
        const awbResult = await queryRunner.manager
          .getRepository(Awb)
          .upsert(createAwbDto, ['name']);

        // scc 정보, awb이 입력되어야 동작하게끔
        // 4. 입력된 scc찾기
        if (vms.Sccs && awbResult.identifiers) {
          const sccResult = await this.sccRepository.find({
            where: { code: In(vms.Sccs.split(',')) },
          });
          // 5. awb와 scc를 연결해주기 위한 작업
          const joinParam = sccResult.map((item) => {
            return {
              Awb: awbResult.identifiers[0].id,
              Scc: item.id,
            };
          });
          await queryRunner.manager.getRepository(AwbSccJoin).save(joinParam);
        }

        await queryRunner.commitTransaction();
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new TypeORMError(`rollback Working - ${error}`);
    } finally {
      await queryRunner.release();
    }
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
        destination: query.destination,
        source: query.source,
        breakDown: query.breakDown,
        piece: query.piece,
        state: query.state,
        parent: query.parent,
        modelPath: query.modelPath,
        dataCapacity: query.dataCapacity,
        flight: query.flight,
        from: query.from,
        airportArrival: query.airportArrival,
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

    // name으로 awb를 찾을 시 모델의 binary를 mqtt에 전송하기 위함, name으로 찾을 시 awb 1개만 나옴
    // TODO: awb의 경로를 유니티에서 읽어야 할 듯 8mb를 binary로 변환 후 mqtt 전송하려면 너무 오래걸리고 서버가 멈춤
    // if (query.name && searchResult && searchResult[0].modelPath) {
    //   const awbModelFile = await this.fileService.readFile(
    //     searchResult[0].modelPath,
    //   );
    //   const imgFilePath = await fs.readFile(searchResult[0].path);
    //   const awbImgFile = await this.fileService.readFile(searchResult[0].path);

    // Buffer를 binary 문자열로 변환합니다.
    // this.client
    //   .send(`hyundai/awb/model`, {
    //     modelFile: awbModelFile.toString('binary'),
    //     imgFile: imgFilePath.toString('binary'),
    //   })
    //   .subscribe();
    // }

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
        // AirCraftSchedules: true,
      },
    });
    return searchResult;
  }

  update(id: number, updateAwbDto: UpdateAwbDto) {
    return this.awbRepository.update(id, updateAwbDto);
  }

  updateState(id: number, state: string, updateAwbDto?: UpdateAwbDto) {
    if (state) updateAwbDto.state = state;
    return this.awbRepository.update(id, updateAwbDto);
  }

  async breakDown(parentName: string, createAwbDtos: CreateAwbDto[]) {
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

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
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

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new TypeORMError(`rollback Working - ${error}`);
    } finally {
      await queryRunner.release();
    }
  }

  async breakDownById(awbId: number, body: CreateAwbBreakDownDto) {
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

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
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

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new TypeORMError(`rollback Working - ${error}`);
    } finally {
      await queryRunner.release();
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

  async modelingCompleteToHandlingPath(
    fileName: string,
    awbName: string,
    filePath: string,
    fileContent: Buffer,
  ) {
    try {
      const targetAwb = await this.awbRepository.findOne({
        where: { barcode: awbName, modelPath: null },
      });

      const pattern = /(obj|ply)/;
      // parameter에 있는 Awb 정보에 모델링파일을 연결합니다.
      if (fileName.includes('png')) {
        await this.awbRepository.update(targetAwb.id, {
          path: filePath,
          state: 'saved',
        }); // png면 path column에 저장
      } else if (pattern.test(fileName)) {
        await this.awbRepository.update(targetAwb.id, {
          modelPath: filePath,
          state: 'saved',
        }); // obj면 modelPath column에 저장
        // binary로 변환시켜서 mqtt publish 하는 로직 삭제 => 너무 오래걸림
      }
    } catch (e) {
      console.error(e);
    }
  }

  async modelingCompleteWithNAS() {
    // vms데이터를 받았다는 신호를전송합니다
    // awb실시간 데이터 mqtt로 publish 하기 위함
    this.client
      .send(`hyundai/vms1/readCompl`, {
        fileRead: true,
      })
      .subscribe();
  }

  async getAwbNotCombineModelPath() {
    return await this.awbRepository.find({
      where: [
        {
          modelPath: IsNull(), // modelPath가 null인 경우, modelPath가 빈 문자열인 경우
          path: IsNull(),
        },
      ],
      order: { id: 'desc' },
    });
  }

  async getAwbByVmsAndMssql() {
    return await this.vmsRepository.find({
      order: orderByUtil(null),
      take: 1,
    });
  }

  /**
   * 엣지에서 보내주는 vms 데이터 중 누락된 데이터를 다시 저장하기 위한 로직
   * @param vmsMissCount edge에서 보내주는 지금까지 보내준 vms의 총 개수
   */
  async preventMissingData(vmsMissCount: number) {
    try {
      // vms와의 차이를 구하기 위해 awb의 총 개수를 구하기
      // const awbAllCount = await this.awbRepository.count();

      // 만약 엣지에서 들어온 숫자와 vms의 전체 숫자가 같지 않으면
      // if (vmsMissCount !== awbAllCount) {
      const awbResult = await this.awbRepository.find({
        order: orderByUtil(null),
        take: 100 * Math.abs(vmsMissCount), // awb테이블의 최소한만 가져오려고 함(개수차이*100)
        // skip: 100 * i,
      });
      // 1 ~ 100 / 101 ~ 200 / 201 ~ 300 ... 누락된 데이터를 찾음
      for (let i = 0; i <= Math.floor(vmsMissCount / 100); i++) {
        const vmsResult = await this.vmsRepository.find({
          order: orderByUtil(null),
          take: 100,
          skip: 100 * i,
        });
        // 누락된 데이터찾기 & 누락되었다면 입력
        for (const vms of vmsResult) {
          const existVms = awbResult.find((awb) => awb.barcode === vms.name);
          if (!existVms && vms.Sccs) {
            // vms가 존재하고 Sccs가 존재한다면 vms에 등록된 scc 정보 찾기
            const sccResult = await this.sccRepository.find({
              where: { code: In(vms.Sccs.split(',')) },
            });

            // awb 등록하는 부분
            const createAwbDto: Partial<CreateAwbDto> = {
              barcode: vms.name,
              waterVolume: vms.waterVolume,
              width: vms.width,
              length: vms.length,
              depth: vms.depth,
              weight: vms.weight,
              state: 'saved',
              modelPath: vms.modelPath,
              scc: sccResult,
            };

            await this.awbRepository.create(createAwbDto);
          }
        }
      }
      // }
    } catch (e) {
      throw new TypeORMError(`rollback Working - ${e}`);
    }
  }
}
