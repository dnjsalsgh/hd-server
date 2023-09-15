import { Test, TestingModule } from '@nestjs/testing';
import { AsrsOutOrderService } from './asrs-out-order.service';
import { INestApplication } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SkidPlatformHistory } from '../skid-platform-history/entities/skid-platform-history.entity';
import { setTypeOrmForTest } from '../lib/util/testSettingTypeorm.util';
import { AsrsOutOrder } from './entities/asrs-out-order.entity';
import { AsrsOutOrderModule } from './asrs-out-order.module';
import { Asrs } from '../asrs/entities/asrs.entity';
import { AsrsModule } from '../asrs/asrs.module';
import { Awb } from '../awb/entities/awb.entity';
import { SkidPlatform } from '../skid-platform/entities/skid-platform.entity';
import { CreateAwbDto } from '../awb/dto/create-awb.dto';
import { CreateAsrsDto } from '../asrs/dto/create-asrs.dto';
import { CreateSkidPlatformDto } from '../skid-platform/dto/create-skid-platform.dto';
import { CreateAsrsOutOrderDto } from './dto/create-asrs-out-order.dto';
import { AwbModule } from '../awb/awb.module';
import { SkidPlatformModule } from '../skid-platform/skid-platform.module';
const getRandomStringFromArray = (arr: string[]): string =>
  arr[Math.floor(Math.random() * arr.length)];

describe('AsrsOutOrderService', () => {
  let asrsOutOrderService: AsrsOutOrderService;
  let app: INestApplication;
  let datasource: DataSource;
  let asrsOutOrderRepository: Repository<AsrsOutOrder>;
  let skidPlatformHistoryRepository: Repository<SkidPlatformHistory>;
  let skidPlatformRepository: Repository<SkidPlatform>;
  let asrsRepository: Repository<Asrs>;
  let awbRepository: Repository<Awb>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        setTypeOrmForTest,
        AsrsModule,
        AwbModule,
        SkidPlatformModule,
        AsrsOutOrderModule,
      ],
      // providers: [AsrsOutOrderService],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    asrsOutOrderRepository = module.get('AsrsOutOrderRepository');
    asrsRepository = module.get('AsrsRepository');
    awbRepository = module.get('AwbRepository');
    skidPlatformRepository = module.get('SkidPlatformRepository');
    asrsOutOrderService = new AsrsOutOrderService(asrsOutOrderRepository);
  });

  it('should be defined', () => {
    expect(asrsOutOrderService).toBeDefined();
    expect(asrsOutOrderRepository).toBeDefined();
  });

  it('AMR 자동창고 적재 정보를 저장 - 목표 객체 설정', async () => {
    const randomStringArray = ['MDE52', 'L4H0q', 'PyvAfKDW', '4dBxU17', '4mI'];
    const asrsRandomName = getRandomStringFromArray(randomStringArray);
    const skidPlatformRandomName = getRandomStringFromArray(randomStringArray);

    // 1. mock 자동창고 데이터 생성
    const testAsrsBody: CreateAsrsDto = {
      name: asrsRandomName,
      parent: 0,
      level: 0,
      orderby: 0,
      fullPath: asrsRandomName,
      x: 0,
      y: 0,
      z: 0,
      simulation: true,
    };
    await asrsRepository.save(testAsrsBody);

    // 2. mock 화물 데이터 생성
    const testAwbBody: CreateAwbDto = {
      name: new Date().getTime().toString(),
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
      state: 'saved',
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
        code: 'Scc-001',
        name: '드라이아이스',
        score: 1,
        description: '',
        path: '',
      },
    };
    await awbRepository.save(testAwbBody);
    // 3. mock 안착대 데이터 생성
    const testSkidPlatformBody: CreateSkidPlatformDto = {
      name: skidPlatformRandomName,
      parent: 0,
      level: 0,
      fullPath: skidPlatformRandomName,
      orderby: 0,
      x: 0,
      y: 0,
      z: 0,
      simulation: true,
    };
    await skidPlatformRepository.save(testSkidPlatformBody);
  });

  it('AMR 자동창고 적재 정보를 저장 - 자동창고 작업지시', async () => {
    // 최상위 asrs 데이터 가져오기
    const lastestAsrs = await asrsRepository.find({
      order: { id: 'desc' },
      take: 1,
    });
    // 최상위 Awb 데이터 가져오기
    const lastestAwb = await awbRepository.find({
      order: { id: 'desc' },
      take: 1,
    });
    // 최상위 skidPlatform 데이터 가져오기
    const lastestSkidPlatform = await skidPlatformRepository.find({
      order: { id: 'desc' },
      take: 1,
    });

    // 작업자 작업지시 생성하기
    const testAsrsOutOrderBody: CreateAsrsOutOrderDto = {
      order: 1,
      Asrs: lastestAsrs[0].id,
      SkidPlatform: lastestSkidPlatform[0].id,
      Awb: lastestAwb[0].id,
    };
    await asrsOutOrderRepository.save(testAsrsOutOrderBody);
  });
});
