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
} from '@nestjs/common';
import { AsrsService } from './asrs.service';
import { CreateAsrsDto } from './dto/create-asrs.dto';
import { UpdateAsrsDto } from './dto/update-asrs.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Asrs } from './entities/asrs.entity';
import { CreateAsrsHistoryDto } from '../asrs-history/dto/create-asrs-history.dto';
import { CreateAsrsPlcDto } from './dto/create-asrs-plc.dto';
import { ClientProxy } from '@nestjs/microservices';

@Controller('asrs')
@ApiTags('Asrs(자동창고)')
export class AsrsController {
  constructor(
    private readonly asrsService: AsrsService,
    @Inject('MQTT_SERVICE') private client: ClientProxy,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Asrs(자동창고) 생성 API',
    description: 'Asrs(자동창고) 생성 한다',
  })
  @ApiBody({ type: CreateAsrsDto })
  @ApiCreatedResponse({ description: '창고를 생성한다.', type: Asrs })
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

  @ApiOperation({ summary: 'Awb, Asrs 함게 이력등록' })
  @Post('/with')
  createWithObject(@Body() createAsrsHistoryDto: CreateAsrsHistoryDto) {
    return this.asrsService.createWithAwb(createAsrsHistoryDto);
  }

  @ApiOperation({ summary: 'plc를 활용한 데이터 수집' })
  @Post('/plc')
  createByPlc(@Body() body: CreateAsrsPlcDto) {
    return this.asrsService.createByPlc(body);
  }

  @Get()
  async findAll() {
    const asrs = await this.asrsService.findAll();
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
}
