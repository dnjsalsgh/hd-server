import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AsrsService } from './asrs.service';
import { Asrs } from './entities/asrs.entity';
import { AsrsHistory } from '../asrs-history/entities/asrs-history.entity';
import { Awb } from '../awb/entities/awb.entity';
import { AwbSccJoin } from '../awb-scc-join/entities/awb-scc-join.entity';
import { AsrsModule } from './asrs.module';
import { INestApplication } from '@nestjs/common';
import { Amr } from '../amr/entities/amr.entity';
import { AmrCharger } from '../amr-charger/entities/amr-charger.entity';
import { AmrChargeHistory } from '../amr-charge-history/entities/amr-charge-history.entity';
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
import { Alarm } from '../alarm/entities/alarm.entity';
import { AwbReturn } from '../awb-return/entities/awb-return.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

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
          host: process.env.DATABASE_HOST,
          port: +process.env.DATABASE_PORT,
          username: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASS,
          database: process.env.DATABASE_NAME,
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
            Alarm,
            AwbReturn,
          ],
          logging: true,
          synchronize: process.env.NODE_ENV === 'dev', // dev 환경일 때만 true
          namingStrategy: new SnakeNamingStrategy(), // db column을 snake_case로 변경
        }),
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    asrsRepository = module.get('AsrsRepository');
    asrsHistoryRepository = module.get('AsrsHistoryRepository');

    // asrsService = new AsrsService(asrsRepository, asrsHistoryRepository);
  });

  // it('should be defined', () => {
  //   expect(asrsService).toBeDefined();
  // });

  it('asrs findOne 테스트', async () => {
    const searchResult = await asrsRepository.findOne({
      where: { name: '창고1' },
    });
    console.log('이거 실행됨');
    console.log(searchResult);
  });
});
