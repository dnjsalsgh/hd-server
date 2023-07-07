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
import { BuildUpOrderService } from './build-up-order.service';
import { CreateBuildUpOrderDto } from './dto/create-build-up-order.dto';
import { UpdateBuildUpOrderDto } from './dto/update-build-up-order.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('inspect-work-order')
@ApiTags('inspect-work-order')
export class BuildUpOrderController {
  constructor(private readonly inspectWorkOrderService: BuildUpOrderService) {}

  @Post()
  create(@Body() createBuildUpOrderDto: CreateBuildUpOrderDto) {
    return this.inspectWorkOrderService.create(createBuildUpOrderDto);
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
    @Body() updateBuildUpOrderDto: UpdateBuildUpOrderDto,
  ) {
    return this.inspectWorkOrderService.update(+id, updateBuildUpOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inspectWorkOrderService.remove(+id);
  }
}
