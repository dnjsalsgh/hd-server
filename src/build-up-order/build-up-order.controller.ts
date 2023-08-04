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
import { BuildUpOrderService } from './build-up-order.service';
import { CreateBuildUpOrderDto } from './dto/create-build-up-order.dto';
import { UpdateBuildUpOrderDto } from './dto/update-build-up-order.dto';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BasicQueryParam } from '../lib/dto/basicQueryParam';
import { BuildUpOrder } from './entities/build-up-order.entity';

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

  @ApiQuery({ name: 'SkidPlatform', required: false, type: 'number' })
  @ApiQuery({ name: 'Uld', required: false, type: 'number' })
  @ApiQuery({ name: 'Awb', required: false, type: 'number' })
  @ApiQuery({ name: 'createdAtFrom', required: false })
  @ApiQuery({ name: 'createdAtTo', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @Get()
  findAll(@Query() query: BuildUpOrder & BasicQueryParam) {
    return this.buildUpOrderService.findAll(query);
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
