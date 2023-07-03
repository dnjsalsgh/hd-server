import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AircraftScheduleService } from './aircraft-schedule.service';
import { CreateAircraftScheduleDto } from './dto/create-aircraft-schedule.dto';
import { UpdateAircraftScheduleDto } from './dto/update-aircraft-schedule.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('aircraft-schedule')
@ApiTags('aircraft-schedule')
export class AircraftScheduleController {
  constructor(
    private readonly aircraftScheduleService: AircraftScheduleService,
  ) {}

  @Post()
  async create(@Body() createAircraftScheduleDto: CreateAircraftScheduleDto) {
    return await this.aircraftScheduleService.create(createAircraftScheduleDto);
  }

  @Get()
  findAll(
    @Query('source') source: string,
    @Query('createdAtFrom') createdAtFrom: Date,
    @Query('createdAtTo') createdAtTo: Date,
    @Query('order') order: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    return this.aircraftScheduleService.findAll(
      source,
      createdAtFrom,
      createdAtTo,
      order,
      limit,
      offset,
    );
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
