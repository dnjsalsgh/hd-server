import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AircraftScheduleService } from './aircraft-schedule.service';
import { CreateAircraftScheduleDto } from './dto/create-aircraft-schedule.dto';
import { UpdateAircraftScheduleDto } from './dto/update-aircraft-schedule.dto';
import { Scope } from 'eslint';

@Controller('aircraft-schedule')
export class AircraftScheduleController {
  constructor(
    private readonly aircraftScheduleService: AircraftScheduleService,
  ) {}

  @Post()
  create(@Body() createAircraftScheduleDto: CreateAircraftScheduleDto) {
    return this.aircraftScheduleService.create(createAircraftScheduleDto);
  }

  @Get()
  findAll(@Query('source') source: string) {
    return this.aircraftScheduleService.findAll(source);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.aircraftScheduleService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateAircraftScheduleDto: UpdateAircraftScheduleDto,
  ) {
    return this.aircraftScheduleService.update(+id, updateAircraftScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aircraftScheduleService.remove(+id);
  }
}
