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
import { take } from 'rxjs';

@Controller('asrs')
@ApiTags('[자동창고]Asrs')
export class AsrsController {
  constructor(
    private readonly asrsService: AsrsService,
    private readonly skidPlatformHistoryService: SkidPlatformHistoryService,
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
  @Post('/plc/asrs')
  createByPlcIn(@Body() body: CreateAsrsPlcDto) {
    return this.asrsService.createByPlcIn(body);
  }

  // 자동창고&스태커크레인&안착대 데이터를 추적하는 mqtt
  // @MessagePattern('hyundai/asrs1/eqData') //구독하는 주제
  @MessagePattern('hyundai/asrs1/data') //구독하는 주제
  createByPlcMatt(@Payload() data) {
    // mqtt에서 넘어온 데이터를 object 형태로 만들기 위한 전처리 과정
    // const handlingAsrsInfoFromIf: { [key: string]: unknown } = {};
    // for (const asrsInfoFromIfElement of data) {
    //   handlingAsrsInfoFromIf[asrsInfoFromIfElement.name] =
    //     asrsInfoFromIfElement.value;
    // }

    // 자동창고 이력을 등록하는 부분

    /**
     * 안착대의 상태를 감지해서 화물을 등록하기 위함
     */
    // if (
    //   handlingAsrsInfoFromIf.Pallet_Rack1_Part_On ||
    //   handlingAsrsInfoFromIf.Pallet_Rack2_Part_On ||
    //   handlingAsrsInfoFromIf.Pallet_Rack3_Part_On ||
    //   handlingAsrsInfoFromIf.Pallet_Rack4_Part_On
    // ) {
    //   this.asrsService.createByPlcIn(handlingAsrsInfoFromIf);
    //   this.skidPlatformHistoryService.checkSkidPlatformChange(
    //     handlingAsrsInfoFromIf,
    //   );
    // }
    // /**
    //  * 자동창고의 in을 처리하기 위함
    //  */
    // this.asrsService.createByPlcIn(handlingAsrsInfoFromIf);

    // 원준님과 이야기 후 data 그대로 넘겨주면 된다는거 파악
    // 자동창고&스태커크레인&안착대 데이터를 발산하는 mqtt
    this.client.send(`hyundai/asrs1/eqData2`, data).pipe(take(1)).subscribe();
  }
}
