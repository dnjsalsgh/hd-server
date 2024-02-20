import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AsrsService } from './asrs.service';
import { CreateAsrsDto } from './dto/create-asrs.dto';
import { UpdateAsrsDto } from './dto/update-asrs.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Asrs } from './entities/asrs.entity';
import { CreateAsrsPlcDto } from './dto/create-asrs-plc.dto';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { SkidPlatformHistoryService } from '../skid-platform-history/skid-platform-history.service';
import { ConfigService } from '@nestjs/config';
import { AwbService } from '../awb/awb.service';

@Controller('asrs')
@ApiTags('[자동창고]Asrs')
export class AsrsController {
  private messageQueue = [];
  private readonly processInterval = 1500; // 처리 간격을 1500ms (1.5초)로 설정
  private processing = false;
  constructor(
    private readonly asrsService: AsrsService,
    private readonly skidPlatformHistoryService: SkidPlatformHistoryService,
    private readonly configService: ConfigService,
    @Inject('MQTT_SERVICE') private client: ClientProxy,
  ) {
    // setInterval(() => this.processMessage(), this.processInterval);
  }

  // 1.5초마다 큐에서 메시지를 꺼내 처리
  // private async processMessage() {
  // if (this.messageQueue.length > 0 && !this.processing) {
  //   this.processing = true; // 처리 중 플래그 설정
  //   const message = this.messageQueue.shift();
  //   await this.asrsService.checkAwb(message);
  //   this.processing = false; // 처리 완료 후 플래그 해제
  //   console.log('asrs, 안착대 누락 awb 확인 로직 동작');
  // }
  // }

  @ApiOperation({
    summary: 'Asrs(자동창고) 생성 API',
    description: 'Asrs(자동창고) 생성 한다',
  })
  @ApiBody({ type: CreateAsrsDto })
  @ApiCreatedResponse({ description: '창고를 생성한다.', type: Asrs })
  @Post()
  async create(@Body() body: CreateAsrsDto) {
    // parent 정보 확인
    if (typeof body.parent === 'number' && body.parent < 0) {
      throw new HttpException('parent 정보를 정확히 입력해주세요', 400);
    }

    body.parent = typeof body.parent === 'number' ? body.parent : 0;
    body.fullPath = body.name;
    const asrs = await this.asrsService.create(body);
    return asrs;
  }

  @ApiQuery({ name: 'simulation', required: false, type: 'boolean' })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'createdAtFrom', required: false })
  @ApiQuery({ name: 'createdAtTo', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @Get()
  async findAll(@Query() query: Asrs & BasicQueryParamDto) {
    const asrs = await this.asrsService.findAll(query);
    return asrs;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.asrsService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAsrsDto: UpdateAsrsDto,
  ) {
    return this.asrsService.update(id, updateAsrsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.asrsService.remove(+id);
  }

  @ApiOperation({
    summary:
      '[사용x] plc를 활용한 창고에 화물 이력(이력등록), plc 데이터를 가정한 테스트용 api',
    description: '창고로 일어나는 작업이기 때문에 asrs로 넣음',
  })
  @Post('/plc/asrs/test')
  createByPlcIn(@Body() body: CreateAsrsPlcDto) {
    return this.asrsService.checkAsrsChange(body);
  }

  @ApiOperation({
    summary: '창고에 오래된 화물 순서대로 불출서열 만들기',
    description: '창고에 오래된 화물 순서대로 불출서열 만들기',
  })
  @Post('/createOutOrder')
  createOurOrder() {
    return this.asrsService.createOutOrder();
  }

  // 3초 딜레이를 위한 Promise 기반의 delay 함수
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // [asrs, skidPlatform] 데이터 수집
  // 자동창고&스태커크레인&안착대 데이터를 추적하는 mqtt
  @MessagePattern('hyundai/asrs1/eqData') //구독하는 주제
  async createByPlcMatt(@Payload() data) {
    if (data && this.configService.get<string>('VMS_DATA') === 'true') {
      // asrs, skidPlatform의 누락된 awb를 가져오기 위한 메서드

      // 3초 딜레이로 부하 줄이기
      if (!this.processing) {
        this.processing = true; // 처리 시작 표시

        // 메시지 처리 로직
        await this.asrsService.checkAwb(data);
        console.log(
          'asrs, skidPlatform의 누락된 awb를 가져오기 위한 메서드 동작함',
        );

        // 3초 딜레이
        await this.delay(3000);

        this.processing = false; // 처리 완료 표시
      }
    }

    if (data && this.configService.get<string>('IF_ACTIVE') === 'true') {
      await this.asrsService.checkAsrsChange(data);
      console.log('asrs 체킹');
      await this.skidPlatformHistoryService.checkSkidPlatformChange(data);
      console.log('skidPlatform 체킹');
      await this.asrsService.makeAlarmFromPlc(data);
      // asrs, skidPlatform의 누락된 awb를 가져오기 위한 메서드
    }
  }
}
// 메시지를 큐에 추가
// this.messageQueue.push(data);
//
// // 메시지 큐의 길이가 10을 초과하면 가장 오래된 메시지부터 제거
// while (this.messageQueue.length > 10) {
//   this.messageQueue.shift(); // 배열의 첫 번째 요소를 제거
// }
