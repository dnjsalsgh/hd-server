import { Test, TestingModule } from '@nestjs/testing';
import { BuildUpOrderService } from './build-up-order.service';
import { INestApplication } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BuildUpOrder } from './entities/build-up-order.entity';
import { Uld } from '../uld/entities/uld.entity';
import { Awb } from '../awb/entities/awb.entity';
import { SkidPlatform } from '../skid-platform/entities/skid-platform.entity';
import {
  setDataSourceForTest,
  setTypeOrmForTest,
} from '../lib/util/testSettingTypeorm.util';
import { BuildUpOrderModule } from './build-up-order.module';
import { UldModule } from '../uld/uld.module';
import { AwbModule } from '../awb/awb.module';
import { SkidPlatformModule } from '../skid-platform/skid-platform.module';
import { CreateBuildUpOrderDto } from './dto/create-build-up-order.dto';
import { CreateUldDto } from '../uld/dto/create-uld.dto';
import { CreateSkidPlatformDto } from '../skid-platform/dto/create-skid-platform.dto';
import { CreateAwbDto } from '../awb/dto/create-awb.dto';
import { SkidPlatformService } from '../skid-platform/skid-platform.service';
import { AsrsHistoryModule } from '../asrs-history/asrs-history.module';
import { AsrsOutOrder } from '../asrs-out-order/entities/asrs-out-order.entity';
import { UldHistory } from '../uld-history/entities/uld-history.entity';
import { UldHistoryModule } from '../uld-history/uld-history.module';
import { AwbService } from '../awb/awb.service';
import { CreateUldHistoryDto } from '../uld-history/dto/create-uld-history.dto';

describe('BuildUpOrderService', () => {
  let app: INestApplication;
  let datasource: DataSource;
  let buildUpOrderRepository: Repository<BuildUpOrder>;
  let uldRepository: Repository<Uld>;
  let uldHistoryRepository: Repository<UldHistory>;
  let awbRepository: Repository<Awb>;
  let skidPlatformRepository: Repository<SkidPlatform>;
  let skidPlatformService: SkidPlatformService;
  let asrsOutOrderRepository: Repository<AsrsOutOrder>;
  let awbService: AwbService;

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [
        setTypeOrmForTest,
        BuildUpOrderModule,
        UldModule,
        AwbModule,
        SkidPlatformModule,
        AsrsHistoryModule,
        UldHistoryModule,
      ],
    }).compile();
    app = testModule.createNestApplication();
    await app.init();

    buildUpOrderRepository = testModule.get('BuildUpOrderRepository');
    uldRepository = testModule.get('UldRepository');
    uldHistoryRepository = testModule.get('UldHistoryRepository');
    awbRepository = testModule.get('AwbRepository');
    skidPlatformRepository = testModule.get('SkidPlatformRepository');
    asrsOutOrderRepository = testModule.get('AsrsOutOrderRepository');
    datasource = new DataSource(setDataSourceForTest);
    // awbService = new AwbService(awbRepository, datasource);
    skidPlatformService = new SkidPlatformService(
      skidPlatformRepository,
      asrsOutOrderRepository,
    );
  });

  it('should be defined', () => {
    expect(buildUpOrderRepository).toBeDefined();
  });

  it('패키지 시뮬레이터 활용 여부 결정 ', async () => {
    // uld안에 화물을 넣은 작업 이력 등록
    const uldHistoryBody: Partial<CreateUldHistoryDto> = {
      x: 1,
      y: 1,
      z: 1,
      pieceCount: 0,
      recommend: true,
      BuildUpOrder: 7,
    };

    await uldHistoryRepository.save(uldHistoryBody);

    // 1. 추천된 순으로 입력을 안하면 추천되는 결과 다시 받아오기
    const buildUpOrderBodyArray: CreateBuildUpOrderDto[] = [
      {
        order: 1,
        x: 1,
        y: 2,
        z: 3,
        SkidPlatform: 1,
        Uld: 2,
        Awb: 1,
      },
      {
        order: 2,
        x: 4,
        y: 5,
        z: 6,
        SkidPlatform: 2,
        Uld: 3,
        Awb: 2,
      },
    ];

    // 등록된 Awb, buildUpOrder는 삭제하지 않기 위해서 uld의 이력을 가져옵니다.
    const uldHistoryResult = await uldHistoryRepository.find({
      where: { Uld: buildUpOrderBodyArray[0].Uld },
      relations: {
        Uld: true,
        Awb: true,
        BuildUpOrder: { Uld: true, Awb: true },
      },
      select: {
        Uld: { id: true },
        Awb: { id: true },
        BuildUpOrder: {
          id: true,
          Uld: { id: true },
          Awb: { id: true },
        },
      },
    });
    console.log(uldHistoryResult);
    // 이력에서 awbId 정보만 가져옵니다.
    const buildUpOrderAwb = uldHistoryResult.map((v) => {
      const existBuildUpOrder = v.BuildUpOrder as BuildUpOrder;
      if (typeof existBuildUpOrder.Awb !== 'number')
        return existBuildUpOrder.Awb.id;
    });

    // 등록된 awb는 제외합니다.
    const filteredBuildUpOrderBody = buildUpOrderBodyArray.filter(
      (v) => !buildUpOrderAwb.includes(v.Awb as number),
    );

    // 이력에 등록된 작업지시를 제외하고 삭제합니다.
    for (const body of filteredBuildUpOrderBody) {
      await buildUpOrderRepository.delete({ Uld: body.Uld, Awb: body.Awb });
    }
    // 새로운 작업지시를 등록합니다.
    await buildUpOrderRepository.upsert(filteredBuildUpOrderBody, [
      'Awb',
      'Uld',
    ]);
  });
});
