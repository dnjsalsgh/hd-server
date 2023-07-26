import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BuildUpOrderService } from './build-up-order.service';
import { CreateBuildUpOrderDto } from './dto/create-build-up-order.dto';
import { UpdateBuildUpOrderDto } from './dto/update-build-up-order.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('build-up-order')
@ApiTags('build-up-order(작업자 작업지시)')
export class BuildUpOrderController {
  constructor(private readonly buildUpOrderService: BuildUpOrderService) {}

  @ApiOperation({ summary: '작업자 작업지시' })
  @Post()
  create(@Body() createBuildUpOrderDto: CreateBuildUpOrderDto) {
    return this.buildUpOrderService.create(createBuildUpOrderDto);
  }

  @ApiOperation({
    summary: '패키지 시뮬레이터의 실행을 위한 컨트롤러',
  })
  @ApiBody({ type: [CreateBuildUpOrderDto] })
  @Post()
  createList(@Body() createBuildUpOrderDto: CreateBuildUpOrderDto[]) {
    return this.buildUpOrderService.createList(createBuildUpOrderDto);
  }

  @Get()
  findAll() {
    return this.buildUpOrderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.buildUpOrderService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateBuildUpOrderDto: UpdateBuildUpOrderDto,
  ) {
    return this.buildUpOrderService.update(+id, updateBuildUpOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.buildUpOrderService.remove(+id);
  }
}
