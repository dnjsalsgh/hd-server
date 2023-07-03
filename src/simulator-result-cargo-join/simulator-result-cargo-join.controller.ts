import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SimulatorResultCargoJoinService } from './simulator-result-cargo-join.service';
import { CreateSimulatorResultCargoJoinDto } from './dto/create-simulator-result-cargo-join.dto';
import { UpdateSimulatorResultCargoJoinDto } from './dto/update-simulator-result-cargo-join.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('simulator-result-cargo-join')
@ApiTags('simulator-result-cargo-join')
export class SimulatorResultCargoJoinController {
  constructor(
    private readonly simulatorResultCargoJoinService: SimulatorResultCargoJoinService,
  ) {}

  @Post()
  create(
    @Body()
    createSimulatorResultCargoJoinDto: CreateSimulatorResultCargoJoinDto,
  ) {
    return this.simulatorResultCargoJoinService.create(
      createSimulatorResultCargoJoinDto,
    );
  }

  @Get()
  findAll() {
    return this.simulatorResultCargoJoinService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.simulatorResultCargoJoinService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateSimulatorResultCargoJoinDto: UpdateSimulatorResultCargoJoinDto,
  ) {
    return this.simulatorResultCargoJoinService.update(
      +id,
      updateSimulatorResultCargoJoinDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.simulatorResultCargoJoinService.remove(+id);
  }
}
