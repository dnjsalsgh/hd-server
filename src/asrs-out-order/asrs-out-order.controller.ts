import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AsrsOutOrderService } from './asrs-out-order.service';
import { CreateAsrsOutOrderDto } from './dto/create-asrs-out-order.dto';
import { UpdateAsrsOutOrderDto } from './dto/update-asrs-out-order.dto';
import { BasicQueryParam } from '../lib/dto/basicQueryParam';
import { AsrsOutOrder } from './entities/asrs-out-order.entity';

@Controller('asrs-out-order')
@ApiTags('asrs-out-order(자동창고 작업지시)')
export class AsrsOutOrderController {
  constructor(private readonly asrsOutOrderService: AsrsOutOrderService) {}

  @Post()
  create(@Body() createAsrsOutOrderDto: CreateAsrsOutOrderDto) {
    return this.asrsOutOrderService.create(createAsrsOutOrderDto);
  }

  @ApiQuery({ name: 'Asrs', required: false, type: 'number' })
  @ApiQuery({ name: 'SkidPlatform', required: false, type: 'number' })
  @ApiQuery({ name: 'Awb', required: false, type: 'number' })
  @ApiQuery({ name: 'createdAtFrom', required: false })
  @ApiQuery({ name: 'createdAtTo', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @Get()
  findAll(@Query() query: AsrsOutOrder & BasicQueryParam) {
    return this.asrsOutOrderService.findAll(query);
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
