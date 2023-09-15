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
import { SimulatorHistoryService } from './simulator-history.service';
import { CreateSimulatorHistoryDto } from './dto/create-simulator-history.dto';
import { UpdateSimulatorHistoryDto } from './dto/update-simulator-history.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { SimulatorHistory } from './entities/simulator-history.entity';

@Controller('simulator-history')
@ApiTags('[시뮬레이터 이력]simulator-history')
export class SimulatorHistoryController {
  constructor(
    private readonly simulatorHistoryService: SimulatorHistoryService,
  ) {}

  @ApiOperation({
    summary:
      '[사용x] 시뮬레이션 이력은 시뮬레이션결과(simulation-result)를 생성하면 자동으로 생성됨',
    description: '',
  })
  @Post()
  create(@Body() createSimulatorHistoryDto: CreateSimulatorHistoryDto) {
    return this.simulatorHistoryService.create(createSimulatorHistoryDto);
  }

  @ApiQuery({ name: 'SimulatorResult', required: false, type: 'number' })
  @ApiQuery({ name: 'Uld', required: false, type: 'number' })
  @ApiQuery({ name: 'Awb', required: false, type: 'number' })
  @ApiQuery({ name: 'createdAtFrom', required: false })
  @ApiQuery({ name: 'createdAtTo', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @Get()
  findAll(@Query() query: SimulatorHistory & BasicQueryParamDto) {
    return this.simulatorHistoryService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.simulatorHistoryService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateSimulatorHistoryDto: UpdateSimulatorHistoryDto,
  ) {
    return this.simulatorHistoryService.update(+id, updateSimulatorHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.simulatorHistoryService.remove(+id);
  }
}
