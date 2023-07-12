import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SimulatorResultService } from './simulator-result.service';
import { CreateSimulatorResultDto } from './dto/create-simulator-result.dto';
import { UpdateSimulatorResultDto } from './dto/update-simulator-result.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('simulator-result')
@ApiTags('simulator-result')
export class SimulatorResultController {
  constructor(
    private readonly simulatorResultService: SimulatorResultService,
  ) {}

  @Post()
  create(@Body() createSimulatorResultDto: CreateSimulatorResultDto) {
    return this.simulatorResultService.create(createSimulatorResultDto);
  }

  @Get()
  findAll() {
    return this.simulatorResultService.findAll();
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
