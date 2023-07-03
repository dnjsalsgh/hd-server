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
import { SimulatorHistoryService } from './simulator-history.service';
import { CreateSimulatorHistoryDto } from './dto/create-simulator-history.dto';
import { UpdateSimulatorHistoryDto } from './dto/update-simulator-history.dto';
import { ApiTags } from '@nestjs/swagger';

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

  @Get()
  findAll() {
    return this.simulatorHistoryService.findAll();
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
