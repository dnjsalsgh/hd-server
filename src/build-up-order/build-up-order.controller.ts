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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('build-up-order')
@ApiTags('build-up-order(작업자 작업지시)')
export class BuildUpOrderController {
  constructor(private readonly inspectWorkOrderService: BuildUpOrderService) {}

  @ApiOperation({ summary: '작업자 작업지시' })
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
