import { Repository } from 'typeorm';
import { Scc } from './entities/scc.entity';
import { INestApplication } from '@nestjs/common';
import { SccService } from './scc.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SccModule } from './scc.module';
import { Amr } from '../amr/entities/amr.entity';
import { AmrCharger } from '../amr-charger/entities/amr-charger.entity';
import { AmrChargeHistory } from '../amr-charge-history/entities/amr-charge-history.entity';
import { Asrs } from '../asrs/entities/asrs.entity';
import { Awb } from '../awb/entities/awb.entity';
import { AwbSccJoin } from '../awb-scc-join/entities/awb-scc-join.entity';
import { Uld } from '../uld/entities/uld.entity';
import { UldHistory } from '../uld-history/entities/uld-history.entity';
import { UldSccJoin } from '../uld-scc-join/entities/uld-scc-join.entity';
import { UldType } from '../uld-type/entities/uld-type.entity';
import { AsrsOutOrder } from '../asrs-out-order/entities/asrs-out-order.entity';
import { BuildUpOrder } from '../build-up-order/entities/build-up-order.entity';
import { SkidPlatform } from '../skid-platform/entities/skid-platform.entity';
import { SkidPlatformHistory } from '../skid-platform-history/entities/skid-platform-history.entity';
import { AsrsHistory } from '../asrs-history/entities/asrs-history.entity';
import { SimulatorResult } from '../simulator-result/entities/simulator-result.entity';
import { SimulatorHistory } from '../simulator-history/entities/simulator-history.entity';
import { SimulatorResultAwbJoin } from '../simulator-result-awb-join/entities/simulator-result-awb-join.entity';
import { TimeTable } from '../time-table/entities/time-table.entity';
import { Aircraft } from '../aircraft/entities/aircraft.entity';
import { AircraftSchedule } from '../aircraft-schedule/entities/aircraft-schedule.entity';
import { CommonCode } from '../common-code/entities/common-code.entity';
import { AwbGroup } from '../awb-group/entities/awb-group.entity';
import { CreateSccDto } from './dto/create-scc.dto';

describe('SccController (e2e)', () => {
  let sccService: SccService;
  let sccRepository: Repository<Scc>;
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        SccModule,
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
          // synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    sccRepository = moduleFixture.get('SccRepository');
    sccService = new SccService(sccRepository);
  });

  it('should be defined', () => {
    expect(sccService).toBeDefined();
  });

  it('scc 등록할 수 있는지 테스트', async () => {
    const mockCreateSccDto: CreateSccDto = {
      code: '',
      name: '',
      score: 1,
      description: '',
      path: '',
    };
    const result = await sccRepository.save(mockCreateSccDto);
    const findResult = await sccRepository.find();

    expect(findResult.length).toBe(1);
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await sccRepository.query('DELETE FROM scc');
  });
});
