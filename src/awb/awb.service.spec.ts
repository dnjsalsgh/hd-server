import { Test, TestingModule } from '@nestjs/testing';
import { AwbService } from './awb.service';
import {
  setDataSourceForTest,
  setTypeOrmForTest,
} from '../lib/util/testSetTypeorm.Object';
import { Awb } from './entities/awb.entity';
import { DataSource, Repository } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { AsrsService } from '../asrs/asrs.service';
import { AwbSccJoin } from '../awb-scc-join/entities/awb-scc-join.entity';
import { AwbModule } from './awb.module';
import { Amr } from '../amr/entities/amr.entity';
import { AmrCharger } from '../amr-charger/entities/amr-charger.entity';
import { AmrChargeHistory } from '../amr-charge-history/entities/amr-charge-history.entity';
import { Asrs } from '../asrs/entities/asrs.entity';
import { Scc } from '../scc/entities/scc.entity';
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
import { CreateAwbDto } from './dto/create-awb.dto';

describe('AwbService', () => {
  let awbService: AwbService;
  let awbRepository: Repository<Awb>;
  let awbJoinRepository: Repository<AwbSccJoin>;
  let app: INestApplication;
  let datasource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [setTypeOrmForTest, AwbModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    awbRepository = module.get('AwbRepository');
    awbJoinRepository = module.get('AwbSccJoinRepository');
    datasource = new DataSource(setDataSourceForTest);
    awbService = new AwbService(awbRepository, awbJoinRepository, datasource);
  });

  it('should be defined', () => {
    expect(awbService).toBeDefined();
  });

  it('awb 테스트 데이터 넣기', async () => {
    const awbTestData: Partial<CreateAwbDto> = {
      name: '화물-001',
      prefab: '3d Model Name',
      waterVolume: 1,
      squareVolume: 1,
      width: 1,
      length: 1,
      depth: 1,
      weight: 1,
      isStructure: true,
      barcode: '010101',
      destination: '미국',
      source: '한국',
      breakDown: false,
      piece: 1,
      state: 'not breakDown',
      parent: 0,
      modelPath: '/c/file/xxx',
      simulation: true,
      dataCapacity: 1,
      flight: 'fly',
      from: '출발지',
      airportArrival: '공항도착',
      path: '/c/file/xxx',
      spawnRatio: 1,
      description: '배송설명',
      rmComment: 'RM 코멘트',
      localTime: new Date(),
      localInTerminal: 'AIR-001',
      scc: {
        code: 'scc-001',
        name: '드라이아이스',
        score: 1,
        description: '',
        path: '',
      },
    };

    const awbInsertResult = await awbRepository.save(awbTestData);
    console.log(awbInsertResult);
    expect(awbInsertResult.id).toBeGreaterThanOrEqual(1);
  });
});
