import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AsrsOutOrderService } from './asrs-out-order.service';
import { CreateAsrsOutOrderDto } from './dto/create-asrs-out-order.dto';
import { UpdateAsrsOutOrderDto } from './dto/update-asrs-out-order.dto';

@Controller('Asrs-out-order')
@ApiTags('Asrs-out-order(자동창고 작업지시)')
export class AsrsOutOrderController {
  constructor(private readonly asrsOutOrderService: AsrsOutOrderService) {}

  @Post()
  create(@Body() createAsrsOutOrderDto: CreateAsrsOutOrderDto) {
    return this.asrsOutOrderService.create(createAsrsOutOrderDto);
  }

  @Get()
  findAll() {
    return this.asrsOutOrderService.findAll();
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
