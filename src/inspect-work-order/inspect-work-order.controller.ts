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
import { InspectWorkOrderService } from './inspect-work-order.service';
import { CreateInspectWorkOrderDto } from './dto/create-inspect-work-order.dto';
import { UpdateInspectWorkOrderDto } from './dto/update-inspect-work-order.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('inspect-work-order')
@ApiTags('inspect-work-order')
export class InspectWorkOrderController {
  constructor(
    private readonly inspectWorkOrderService: InspectWorkOrderService,
  ) {}

  @Post()
  create(@Body() createInspectWorkOrderDto: CreateInspectWorkOrderDto) {
    return this.inspectWorkOrderService.create(createInspectWorkOrderDto);
  }

  @Get()
  findAll() {
    return this.inspectWorkOrderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inspectWorkOrderService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateInspectWorkOrderDto: UpdateInspectWorkOrderDto,
  ) {
    return this.inspectWorkOrderService.update(+id, updateInspectWorkOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inspectWorkOrderService.remove(+id);
  }
}
