import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AsrsOutOrderService } from './asrs-out-order.service';
import { CreateAsrsOutOrderDto } from './dto/create-asrs-out-order.dto';
import { UpdateAsrsOutOrderDto } from './dto/update-asrs-out-order.dto';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { AsrsOutOrder } from './entities/asrs-out-order.entity';
import { CreateAwbDto } from '../awb/dto/create-awb.dto';

@Controller('asrs-out-order')
@ApiTags('[자동창고 작업지시]asrs-out-order')
export class AsrsOutOrderController {
  constructor(private readonly asrsOutOrderService: AsrsOutOrderService) {}

  @ApiOperation({
    summary:
      '[사용x] 자동창고(asrs) 에서 불출될 화물(awb)를 지정하는 작업지시, 패키지 시뮬레이션으로 등록되기 때문에 사용할 필요 없음',
    description:
      '[사용법] order: 불출순서, Asrs: 불출될 창고(랙), Awb: 목표 화물',
  })
  @Post()
  create(@Body() createAsrsOutOrderDto: CreateAsrsOutOrderDto) {
    return this.asrsOutOrderService.create(createAsrsOutOrderDto);
  }

  @ApiQuery({ name: 'Asrs', required: false, type: 'number' })
  @ApiQuery({ name: 'SkidPlatform', required: false, type: 'number' })
  @ApiQuery({ name: 'Awb', required: false, type: 'number' })
  @ApiQuery({ name: 'Uld', required: false, type: 'number' })
  @ApiQuery({ name: 'createdAtFrom', required: false })
  @ApiQuery({ name: 'createdAtTo', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @Get()
  findAll(@Query() query: AsrsOutOrder & BasicQueryParamDto) {
    return this.asrsOutOrderService.findAll(query);
  }

  @ApiOperation({
    summary: '가장 최신 불출서열 알아내는 api',
    description: 'order: 불출순서, Asrs: 불출될 창고(랙), Awb: 목표 화물',
  })
  @Get('/target')
  findTarget() {
    return this.asrsOutOrderService.findTarget();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.asrsOutOrderService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateAsrsOutOrderDto: UpdateAsrsOutOrderDto,
  ) {
    return this.asrsOutOrderService.update(+id, updateAsrsOutOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.asrsOutOrderService.remove(+id);
  }
}
