import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SimulatorResultAwbJoinService } from './simulator-result-awb-join.service';
import { CreateSimulatorResultAwbJoinDto } from './dto/create-simulator-result-awb-join.dto';
import { UpdateSimulatorResultAwbJoinDto } from './dto/update-simulator-result-awb-join.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('simulator-result-Awb-join')
@ApiTags('simulator-result-Awb-join')
export class SimulatorResultAwbJoinController {
  constructor(
    private readonly simulatorResultAwbJoinService: SimulatorResultAwbJoinService,
  ) {}

  @Post()
  create(
    @Body()
    createSimulatorResultCargoJoinDto: CreateSimulatorResultAwbJoinDto,
  ) {
    return this.simulatorResultAwbJoinService.create(
      createSimulatorResultCargoJoinDto,
    );
  }

  @Get()
  findAll() {
    return this.simulatorResultAwbJoinService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.simulatorResultAwbJoinService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateSimulatorResultCargoJoinDto: UpdateSimulatorResultAwbJoinDto,
  ) {
    return this.simulatorResultAwbJoinService.update(
      +id,
      updateSimulatorResultCargoJoinDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.simulatorResultAwbJoinService.remove(+id);
  }
}
