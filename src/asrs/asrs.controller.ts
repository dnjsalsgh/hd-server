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

@Controller('asrs')
@ApiTags('[자동창고]Asrs')
export class AsrsController {
  private processing = false;

  constructor(
    private readonly asrsService: AsrsService,
    private readonly skidPlatformHistoryService: SkidPlatformHistoryService,
    private readonly configService: ConfigService,
    @Inject('MQTT_SERVICE') private client: ClientProxy,
  ) {}

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
    // asrs, skidPlatform의 누락된 awb를 가져오기 위한 로직
    if (data && this.configService.get<string>('VMS_DATA') === 'true') {
      // 3초 딜레이로 부하 줄이기
      if (!this.processing) {
        this.processing = true; // 처리 시작 표시

        // 메시지 처리 로직
        await this.asrsService.checkAwb(data);

        // 3초 딜레이
        await this.delay(3000);

        this.processing = false; // 처리 완료 표시
      }
    }

    // 창고, 안착대의 in,out을 관리하기 위한 로직
    if (data && this.configService.get<string>('IF_ACTIVE') === 'true') {
      await this.asrsService.checkAsrsChange(data);

      await this.skidPlatformHistoryService.checkSkidPlatformChange(data);

      await this.asrsService.makeAlarmFromPlc(data);
    }
  }
}
