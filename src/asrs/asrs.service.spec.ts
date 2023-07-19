import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AsrsService } from './asrs.service';
import { Asrs } from './entities/asrs.entity';
import { AsrsHistory } from '../asrs-history/entities/asrs-history.entity';
import { Amr } from '../amr/entities/amr.entity';
import { AmrCharger } from '../amr-charger/entities/amr-charger.entity';
import { AmrChargeHistory } from '../amr-charge-history/entities/amr-charge-history.entity';
import { Awb } from '../awb/entities/awb.entity';
import { AwbSccJoin } from '../awb-scc-join/entities/awb-scc-join.entity';
import { Scc } from '../scc/entities/scc.entity';
import { Uld } from '../uld/entities/uld.entity';
import { UldHistory } from '../uld-history/entities/uld-history.entity';
import { UldSccJoin } from '../uld-scc-join/entities/uld-scc-join.entity';
import { UldType } from '../uld-type/entities/uld-type.entity';
import { AsrsOutOrder } from '../asrs-out-order/entities/asrs-out-order.entity';
import { BuildUpOrder } from '../build-up-order/entities/build-up-order.entity';
import { SkidPlatform } from '../skid-platform/entities/skid-platform.entity';
import { SkidPlatformHistory } from '../skid-platform-history/entities/skid-platform-history.entity';
import { SimulatorResult } from '../simulator-result/entities/simulator-result.entity';
import { SimulatorHistory } from '../simulator-history/entities/simulator-history.entity';
import { SimulatorResultAwbJoin } from '../simulator-result-awb-join/entities/simulator-result-awb-join.entity';
import { TimeTable } from '../time-table/entities/time-table.entity';
import { Aircraft } from '../aircraft/entities/aircraft.entity';
import { AircraftSchedule } from '../aircraft-schedule/entities/aircraft-schedule.entity';
import { CommonCode } from '../common-code/entities/common-code.entity';
import { AwbGroup } from '../awb-group/entities/awb-group.entity';
import { AsrsModule } from './asrs.module';
import { INestApplication } from '@nestjs/common';
import { CreateAsrsPlcDto } from './dto/create-asrs-plc.dto';
import { CreateAsrsHistoryDto } from '../asrs-history/dto/create-asrs-history.dto';
import { CreateAsrsDto } from './dto/create-asrs.dto';
import { CreateAwbDto } from '../awb/dto/create-awb.dto';

const mockAsrsRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
});
const mockAsrsHistoryRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('AsrsService', () => {
  let asrsService: AsrsService;
  let asrsRepository: Repository<Asrs>;
  let asrsHistoryRepository: Repository<AsrsHistory>;
  let awbRepository: Repository<Awb>;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AsrsModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          database: 'test',
          entities: [
            Amr,
            AmrCharger,
            AmrChargeHistory,
            Asrs,
            Awb,
            AwbSccJoin,
            Scc,
            Uld,
            UldHistory,
            UldSccJoin,
            UldType,
            AsrsOutOrder,
            BuildUpOrder,
            SkidPlatform,
            SkidPlatformHistory,
            AsrsHistory,
            SimulatorResult,
            SimulatorHistory,
            SimulatorResultAwbJoin,
            TimeTable,
            Aircraft,
            AircraftSchedule,
            CommonCode,
            AwbGroup,
          ],
          host: 'localhost',
          username: 'postgres',
          password: '1234',
          port: 5432,
          logging: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    asrsRepository = module.get('AsrsRepository');
    asrsHistoryRepository = module.get('AsrsHistoryRepository');

    asrsService = new AsrsService(asrsRepository, asrsHistoryRepository);
  });

  it('should be defined', () => {
    expect(asrsService).toBeDefined();
  });

  it('plc에서 온 데이터로 자동창고에 화물 등록하기', async () => {
    /**
     * plc로 들어온 데이터를 창고에 입력 데이터로 입력 후 이력 등록
     * awb와 asrs의 정보를 처리해야함
     * @param body
     */
    const createByPlcIn = async (body: CreateAsrsPlcDto) => {
      // TODO: 가정된 데이터들 어떤 화물정보가 들어있을줄 모르니 다 분기처리할 것
      // 자동창고 Id 들어왔다고 가정
      const asrsId = +body.LH_ASRS_ID || +body.RH_ASRS_ID;
      const awbInfo = body.ASRS_LH_Rack1_Part_Info as {
        awbId: number;
        count: number;
      };
      console.log(awbInfo.awbId);
      // 화물정보 안에 화물Id 들어왔다고 가정
      const awbId = awbInfo.awbId;
      // 화물정보 안에 화물수량 들어왔다고 가정
      const count = awbInfo.count;
      // 화물이 인입인지 인출인지 확인
      let inOutType = '';
      if (body.In_Conveyor_Start) {
        inOutType = 'in';
      } else if (body.Out_Conveyor_Start) {
        inOutType = 'out';
      }

      const asrsHistoryBody: CreateAsrsHistoryDto = {
        Asrs: asrsId,
        Awb: awbId,
        inOutType: inOutType,
        count: count,
      };

      const historyResult = await asrsHistoryRepository.save(asrsHistoryBody);
      console.log('historyResult = ', historyResult);
      expect(historyResult.id).toBeGreaterThanOrEqual(1);
    };
    const testPlcData: CreateAsrsPlcDto = {
      LH_ASRS_ID: '1',
      ASRS_LH_Rack1_Part_Info: { awbId: 1, count: 10 } as unknown,
      In_Conveyor_Start: true,
    };
    await createByPlcIn(testPlcData);
  });
});
