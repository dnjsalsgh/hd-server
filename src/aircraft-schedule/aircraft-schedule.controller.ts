import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AircraftScheduleService } from './aircraft-schedule.service';
import { CreateAircraftScheduleDto } from './dto/create-aircraft-schedule.dto';
import { UpdateAircraftScheduleDto } from './dto/update-aircraft-schedule.dto';

@Controller('aircraft-schedule')
export class AircraftScheduleController {
  constructor(private readonly aircraftScheduleService: AircraftScheduleService) {}

  @Post()
  create(@Body() createAircraftScheduleDto: CreateAircraftScheduleDto) {
    return this.aircraftScheduleService.create(createAircraftScheduleDto);
  }

  @Get()
  findAll() {
    return this.aircraftScheduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aircraftScheduleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAircraftScheduleDto: UpdateAircraftScheduleDto) {
    return this.aircraftScheduleService.update(+id, updateAircraftScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aircraftScheduleService.remove(+id);
  }
}
