import { Test, TestingModule } from '@nestjs/testing';
import { SimulatorResultService } from './simulator-result.service';
import {
  setDataSourceForTest,
  setTypeOrmForTest,
} from '../lib/util/testSetTypeorm.Object';
import { SimulatorResultModule } from './simulator-result.module';
import { DataSource, Repository, TypeORMError } from 'typeorm';
import { SimulatorResult } from './entities/simulator-result.entity';
import { INestApplication, NotFoundException } from '@nestjs/common';
import dayjs from 'dayjs';
import { CreateSimulatorResultAwbJoinDto } from '../simulator-result-awb-join/dto/create-simulator-result-awb-join.dto';
import { CreateSimulatorHistoryDto } from '../simulator-history/dto/create-simulator-history.dto';
import { SimulatorResultAwbJoin } from '../simulator-result-awb-join/entities/simulator-result-awb-join.entity';
import { SimulatorHistory } from '../simulator-history/entities/simulator-history.entity';
import { CreateSimulatorResultWithAwbAndHistoryDto } from './dto/create-simulator-result-with-awb';

describe('SimulatorResultService', () => {
  let simulatorResultService: SimulatorResultService;
  let simulatorResultRepository: Repository<SimulatorResult>;
  let simulatorHistoryRepository: Repository<SimulatorHistory>;
  let SimulatorResultAwbJoinRepository: Repository<SimulatorResultAwbJoin>;
  let app: INestApplication;
  let dataSource: DataSource;
  let testdataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [setTypeOrmForTest, SimulatorResultModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    simulatorResultRepository = module.get('SimulatorResultRepository');
    SimulatorResultAwbJoinRepository = module.get(
      'SimulatorResultAwbJoinRepository',
    );
    simulatorHistoryRepository = module.get('SimulatorHistoryRepository');
    dataSource = new DataSource(setDataSourceForTest);
    // // testdataSource = module.get('DataSource');
    // simulatorResultService = new SimulatorResultService(
    //   simulatorResultRepository,
    //   dataSource,
    // );
  });

  it('should be defined', async () => {
    expect(simulatorResultService).toBeDefined();
    expect(dataSource).toBeDefined();

    const queryRunner = dataSource.createQueryRunner();
    // const testQueryRunner = testdataSource.createQueryRunner();
    // expect(await testQueryRunner.connect()).toBe(true);
    expect(await queryRunner.connect()).toBe(true);
    expect(dataSource.isInitialized).toBe(true);
  });

  it('"패키지 시뮬레이터 - 결과 관리 시뮬레이션 모드 처리', async () => {
    const testSimulationResultBody: CreateSimulatorResultWithAwbAndHistoryDto =
      {
        startDate: dayjs().toDate(),
        endDate: dayjs().toDate(),
        loadRate: 10,
        version: 0.1,
        Uld: 2,
        AwbWithXYZ: [
          {
            Awb: 1,
            x: 10,
            y: 20,
            z: 30,
          },
          {
            Awb: 2,
            x: 20,
            y: 30,
            z: 40,
          },
          {
            Awb: 3,
            x: 30,
            y: 40,
            z: 50,
          },
        ],
      };
    // simulatorResultService.createWithAwb(testSimulationResultBody);
    // const queryRunner = await dataSource.createQueryRunner();
    // await queryRunner.connect();
    // await queryRunner.startTransaction();

    try {
      // Awb의 정보 validation 체크
      if (
        !testSimulationResultBody.AwbWithXYZ.every(
          (obj) => 'Awb' in obj && 'x' in obj && 'y' in obj && 'z' in obj,
        )
      ) {
        throw new NotFoundException('Awb 상세 정보가 없습니다.');
      }

      // 1. simulatorResult 입력
      const simulatorResultResult = await simulatorResultRepository.save(
        testSimulationResultBody,
      );
      // .getRepository(SimulatorResult)
      // .save(testSimulationResultBody);

      const joinParamArray: CreateSimulatorResultAwbJoinDto[] = [];
      const historyParamArray: CreateSimulatorHistoryDto[] = [];

      // 2. 입력되는 화물과 좌표를 이력에 입력
      for (let i = 0; i < testSimulationResultBody.AwbWithXYZ.length; i++) {
        // 2-1. Awb 이력 입력
        const joinParam: CreateSimulatorResultAwbJoinDto = {
          Awb: testSimulationResultBody.AwbWithXYZ[i].Awb,
          SimulatorResult: simulatorResultResult.id,
        };
        joinParamArray.push(joinParam);

        // 2-2. SimulatorHistory 입력
        const historyParam: CreateSimulatorHistoryDto = {
          Uld: testSimulationResultBody.Uld,
          Awb: testSimulationResultBody.AwbWithXYZ[i].Awb,
          SimulatorResult: simulatorResultResult.id,
          x: testSimulationResultBody.AwbWithXYZ[i].x,
          y: testSimulationResultBody.AwbWithXYZ[i].y,
          z: testSimulationResultBody.AwbWithXYZ[i].z,
        };
        historyParamArray.push(historyParam);
      }

      const joinResult = await SimulatorResultAwbJoinRepository.save(
        joinParamArray,
      );
      // queryRunner.manager
      // .getRepository(SimulatorResultAwbJoin)
      // .save(joinParamArray);
      const historyResult = await simulatorHistoryRepository.save(
        historyParamArray,
      );
      // queryRunner.manager
      // .getRepository(SimulatorHistory)
      // .save(historyParamArray);

      // awbjoin 테이블, 이력 테이블 함께 저장
      await Promise.all([joinResult, historyResult]);

      // await queryRunner.commitTransaction();
    } catch (error) {
      // await queryRunner.rollbackTransaction();
      throw new TypeORMError(`rollback Working - ${error}`);
    } finally {
      // await queryRunner.release();
    }
  });
});
