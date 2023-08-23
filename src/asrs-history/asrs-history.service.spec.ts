import { Test, TestingModule } from '@nestjs/testing';
import { AsrsHistoryService } from './asrs-history.service';
import {
  setDataSourceForTest,
  setTypeOrmForTest,
} from '../lib/util/testSetTypeorm.util';
import { AsrsHistoryModule } from './asrs-history.module';
import { INestApplication } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Asrs } from '../asrs/entities/asrs.entity';
import { AsrsHistory } from './entities/asrs-history.entity';
import { CreateAsrsPlcDto } from '../asrs/dto/create-asrs-plc.dto';
import { CreateAsrsHistoryDto } from './dto/create-asrs-history.dto';
import { AsrsModule } from '../asrs/asrs.module';
import { CreateSkidPlatformHistoryDto } from '../skid-platform-history/dto/create-skid-platform-history.dto';
import { SkidPlatformHistory } from '../skid-platform-history/entities/skid-platform-history.entity';
import { SkidPlatformHistoryModule } from '../skid-platform-history/skid-platform-history.module';

describe('AsrsHistoryService', () => {
  let asrsHisotryService: AsrsHistoryService;
  let app: INestApplication;
  let datasource: DataSource;
  let asrsRepository: Repository<Asrs>;
  let asrsHistoryRepository: Repository<AsrsHistory>;
  let skidPlatformHistoryRepository: Repository<SkidPlatformHistory>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        setTypeOrmForTest,
        SkidPlatformHistoryModule,
        AsrsModule,
        AsrsHistoryModule,
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    asrsRepository = module.get('AsrsRepository');
    asrsHistoryRepository = module.get('AsrsHistoryRepository');
    skidPlatformHistoryRepository = module.get('SkidPlatformHistoryRepository');

    datasource = new DataSource(setDataSourceForTest);
    asrsHisotryService = new AsrsHistoryService(
      asrsHistoryRepository,
      datasource,
    );
  });

  it('should be defined', () => {
    expect(asrsHisotryService).toBeDefined();
  });

  it('plc 데이터로 asrs불출 이력 작성하기', async () => {
    /**
     * plc로 들어온 데이터를 가지고 이력 등록
     * awb와 asrs의 정보를 처리해야함
     * @param plcData
     */
    const createByPlc = async (plcData: CreateAsrsPlcDto) => {
      // 자동창고 Id 들어왔다고 가정
      const asrsId = +plcData.LH_ASRS_ID;

      const awbInfo = plcData.ASRS_LH_Rack1_Part_Info as { awbId: 1; count: 1 };
      // 화물정보 안에 화물Id 들어왔다고 가정
      const awbId = +awbInfo.awbId;
      // 화물정보 안에 화물수량 들어왔다고 가정
      const count = awbInfo.count;
      // 화물이 인입인지 인출인지 확인
      let inOutType = '';
      if (plcData.In_Conveyor_Start) {
        inOutType = 'in';
      } else if (plcData.Out_Conveyor_Start) {
        inOutType = 'out';
      }

      const asrsHistoryBody: CreateAsrsHistoryDto = {
        Asrs: asrsId,
        Awb: awbId,
        inOutType: inOutType,
        count: count,
      };
      console.log(asrsHistoryBody);
      const asrsHistoryResult = await asrsHistoryRepository.save(
        asrsHistoryBody,
      );

      if (inOutType === 'out') {
        const skidPlatformHistoryBody: CreateSkidPlatformHistoryDto = {
          AsrsOutOrder: 1, // 이상함, 자동창고 작업지시가 없으면 안착대 이력 생성 불가능한데;
          Asrs: asrsId,
          SkidPlatform: null, // 어떤 안착대에 갈 지 모르기 때문에 null 처리 가능한데;
          Awb: awbId,
          inOutType: 'in',
          count: 10,
        };
        await skidPlatformHistoryRepository.save(skidPlatformHistoryBody);
      }

      expect(asrsHistoryResult).toBeDefined();
    };

    const testPlcData: CreateAsrsPlcDto = {
      In_Conveyor_Start: false,
      In_Conveyor_Stop: false,
      In_Conveyor_Part_OK1: false,
      In_Conveyor_Part_OK2: false,
      In_Conveyor_Total_Error: false,
      In_Conveyor_Speed: 1,
      Out_Conveyor_Start: true,
      Out_Conveyor_Stop: false,
      Out_Conveyor_Part_OK1: false,
      Out_Conveyor_Part_OK2: false,
      Out_Conveyor_Total_Error: false,
      Out_Conveyor_Speed: 1,
      Stacker_Part_On: false,
      Stacker_Total_Error: false,
      Stacker_Pause: false,
      Stacker_Work_Wait: false,
      Stacker_Work_Load: false,
      Stacker_Work_Unload: false,
      Stacker_Speed: 1,
      Stacker_Position_X: 1,
      Stacker_Position_Y: 1,
      Stacker_Position_Z: 1,
      Stacker_CT: 1,
      LH_Rack1_Part_On: false,
      LH_Rack2_Part_On: false,
      LH_Rack3_Part_On: false,
      LH_Rack4_Part_On: false,
      LH_Rack5_Part_On: false,
      LH_Rack6_Part_On: false,
      LH_Rack7_Part_On: false,
      LH_Rack8_Part_On: false,
      LH_Rack9_Part_On: false,
      RH_Rack1_Part_On: false,
      RH_Rack2_Part_On: false,
      RH_Rack3_Part_On: false,
      RH_Rack4_Part_On: false,
      RH_Rack5_Part_On: false,
      RH_Rack6_Part_On: false,
      RH_Rack7_Part_On: false,
      RH_Rack8_Part_On: false,
      RH_Rack9_Part_On: false,
      LH_Rack_Total_Error: false,
      RH_Rack_Total_Error: false,
      Part_Status: false,
      Count_Rack_Part_On: 1,
      LH_ASRS_ID: '1',
      RH_ASRS_ID: '1',
      LH_Rack1_ID: '1',
      LH_Rack2_ID: '1',
      LH_Rack3_ID: '1',
      LH_Rack4_ID: '1',
      LH_Rack5_ID: '1',
      LH_Rack6_ID: '1',
      LH_Rack7_ID: '1',
      LH_Rack8_ID: '1',
      LH_Rack9_ID: '1',
      RH_Rack1_ID: '1',
      RH_Rack2_ID: '1',
      RH_Rack3_ID: '1',
      RH_Rack4_ID: '1',
      RH_Rack5_ID: '1',
      RH_Rack6_ID: '1',
      RH_Rack7_ID: '1',
      RH_Rack8_ID: '1',
      RH_Rack9_ID: '1',
      ASRS_LH_Rack1_Part_Info: {
        awbId: 1,
        count: 10,
      },
      ASRS_LH_Rack2_Part_Info: {
        awbId: 1,
        count: 10,
      },
      ASRS_LH_Rack3_Part_Info: {
        awbId: 1,
        count: 10,
      },
      ASRS_LH_Rack4_Part_Info: {
        awbId: 1,
        count: 10,
      },
      ASRS_LH_Rack5_Part_Info: {
        awbId: 1,
        count: 10,
      },
      ASRS_LH_Rack6_Part_Info: {
        awbId: 1,
        count: 10,
      },
      ASRS_LH_Rack7_Part_Info: {
        awbId: 1,
        count: 10,
      },
      ASRS_LH_Rack8_Part_Info: {
        awbId: 1,
        count: 10,
      },
      ASRS_LH_Rack9_Part_Info: {
        awbId: 1,
        count: 10,
      },
      ASRS_RH_Rack1_Part_Info: {
        awbId: 1,
        count: 10,
      },
      ASRS_RH_Rack2_Part_Info: {
        awbId: 1,
        count: 10,
      },
      ASRS_RH_Rack3_Part_Info: {
        awbId: 1,
        count: 10,
      },
      ASRS_RH_Rack4_Part_Info: {
        awbId: 1,
        count: 10,
      },
      ASRS_RH_Rack5_Part_Info: {
        awbId: 1,
        count: 10,
      },
      ASRS_RH_Rack6_Part_Info: {
        awbId: 1,
        count: 10,
      },
      ASRS_RH_Rack7_Part_Info: {
        awbId: 1,
        count: 10,
      },
      ASRS_RH_Rack8_Part_Info: {
        awbId: 1,
        count: 10,
      },
      ASRS_RH_Rack9_Part_Info: {
        awbId: 1,
        count: 10,
      },
    };

    await createByPlc(testPlcData);
  });
});
