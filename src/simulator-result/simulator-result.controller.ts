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
import { SimulatorResultService } from './simulator-result.service';
import { CreateSimulatorResultDto } from './dto/create-simulator-result.dto';
import { UpdateSimulatorResultDto } from './dto/update-simulator-result.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateSimulatorResultWithAwbAndHistoryDto } from './dto/create-simulator-result-with-awb';
import { Asrs } from '../asrs/entities/asrs.entity';
import { BasicQueryParam } from '../lib/dto/basicQueryParam';
import { SimulatorResult } from './entities/simulator-result.entity';
import { CreateSimulatorResultOrderDto } from './dto/create-simulator-result-order.dto';

@Controller('simulator-result')
@ApiTags('[시뮬레이터 결과]simulator-result')
export class SimulatorResultController {
  constructor(
    private readonly simulatorResultService: SimulatorResultService,
  ) {}

  @Post()
  create(@Body() createSimulatorResultDto: CreateSimulatorResultDto) {
    return this.simulatorResultService.create(createSimulatorResultDto);
  }

  @ApiOperation({ summary: 'history까지 함께 입력' })
  @Post('/with-Awb-history')
  createWithAwb(@Body() body: CreateSimulatorResultWithAwbAndHistoryDto) {
    return this.simulatorResultService.createWithAwb(body);
  }

  @ApiOperation({
    summary: '패키지 시뮬레이터를 사용해서 asrs, uld 작업지시 만들기',
  })
  @Post('/make-order')
  createOrder(@Body() body: CreateSimulatorResultOrderDto) {
    return this.simulatorResultService.createOrder(body);
  }

  @ApiQuery({ name: 'Uld', required: false, type: 'number' })
  @ApiQuery({ name: 'loadRate', required: false })
  @ApiQuery({ name: 'version', required: false })
  @ApiQuery({ name: 'createdAtFrom', required: false })
  @ApiQuery({ name: 'createdAtTo', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @Get()
  findAll(@Query() query: SimulatorResult & BasicQueryParam) {
    return this.simulatorResultService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.simulatorResultService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateSimulatorResultDto: UpdateSimulatorResultDto,
  ) {
    return this.simulatorResultService.update(+id, updateSimulatorResultDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.simulatorResultService.remove(+id);
  }
}
