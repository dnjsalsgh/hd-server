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
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { BasicQueryParam } from '../lib/dto/basicQueryParam';
import { SimulatorHistory } from './entities/simulator-history.entity';

@Controller('simulator-history')
@ApiTags('simulator-history')
export class SimulatorHistoryController {
  constructor(
    private readonly simulatorHistoryService: SimulatorHistoryService,
  ) {}

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
  findAll(@Query() query: SimulatorHistory & BasicQueryParam) {
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
