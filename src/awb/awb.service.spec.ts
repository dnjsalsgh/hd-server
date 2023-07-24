import { Test, TestingModule } from '@nestjs/testing';
import { AwbService } from './awb.service';
import {
  setDataSourceForTest,
  setTypeOrmForTest,
} from '../lib/util/testSetTypeorm.Object';
import { Awb } from './entities/awb.entity';
import { DataSource, Repository } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { AwbSccJoin } from '../awb-scc-join/entities/awb-scc-join.entity';
import { AwbModule } from './awb.module';
import { CreateAwbDto } from './dto/create-awb.dto';
import { UpdateAwbDto } from './dto/update-awb.dto';
import { MqttModule } from '../mqtt.module';
import { MqttService } from '../mqtt.service';
import {
  ClientProxy,
  ClientProxyFactory,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { take } from 'rxjs';
import { CreateAsrsDto } from '../asrs/dto/create-asrs.dto';
import { Asrs } from '../asrs/entities/asrs.entity';
import { AsrsModule } from '../asrs/asrs.module';

const clients = ClientsModule.register([
  {
    name: 'MQTT_SERVICE', //* MY_MQTT_SERVICE : 의존성 이름
    transport: Transport.MQTT,
    options: {
      host: 'localhost',
      port: 1883,
    },
  },
]);

describe('AwbService', () => {
  let awbService: AwbService;
  let awbRepository: Repository<Awb>;
  let asrsRepository: Repository<Asrs>;
  let awbJoinRepository: Repository<AwbSccJoin>;
  let app: INestApplication;
  let datasource: DataSource;
  let client: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [setTypeOrmForTest, AwbModule, AsrsModule, clients],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    client = ClientProxyFactory.create({
      transport: Transport.MQTT,
      options: {
        host: 'localhost',
        port: 1883,
      },
    });
    awbRepository = module.get('AwbRepository');
    awbJoinRepository = module.get('AwbSccJoinRepository');
    asrsRepository = module.get('AsrsRepository');
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

  it('VMS 데이터 수집 및 처리', async () => {
    // 1. mqtt로 vms가 들어왔다고 가정합니다.
    // 2. scc정보가 같이 들어왔다고 가정합니다.

    const awbBodyTest: Partial<CreateAwbDto> = {
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
      path: '',
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

    // 3. awb db에 저장합니다.
    await awbRepository.save(awbBodyTest);

    // 단위 테스트용 창고(asrs)를 생성합니다.
    const asrsBodyTest: Partial<CreateAsrsDto> = {
      name: 'test',
      parent: 0,
      level: 0,
      orderby: 0,
      x: 0,
      y: 0,
      z: 0,
      simulation: true,
    };
    await asrsRepository.save(asrsBodyTest);

    // 4. 모델링 완료 신호를 받았다고 가정합니다.
    // 최신 awb의 정보를 가져와서 모델링파일을 연결합니다.
    const lastedAwb = await awbRepository.find({
      order: { id: 'desc' },
      take: 1,
    });
    console.log(lastedAwb);

    // 5. nas 서버에서 이미지를 받았다고 가정합니다.
    const updateCargoDto: UpdateAwbDto = {
      path: '/upload/13d13030d53cbc385a9eecbdf734a4b1',
    };
    const awbUpdateResult = await awbRepository.update(
      lastedAwb[0].id,
      updateCargoDto,
    );
    console.log(awbUpdateResult);

    const findOneResult = await awbRepository.findOne({
      where: { id: lastedAwb[0].id },
    });
    // mqtt에 publish 합니다.
    await client
      .send('amr', {
        test: findOneResult,
        time: new Date().toISOString(),
      })
      .pipe(take(1))
      .subscribe();
  });
});
