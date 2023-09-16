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
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('aircraft-schedule')
@ApiTags('[항공기 스케줄]aircraft-schedule')
export class AircraftScheduleController {
  constructor(
    private readonly aircraftScheduleService: AircraftScheduleService,
  ) {}

  @Post()
  async create(@Body() createAircraftScheduleDto: CreateAircraftScheduleDto) {
    return await this.aircraftScheduleService.create(createAircraftScheduleDto);
  }

  @ApiOperation({
    summary: '항공편 안에 화물 정보를 넣어서 입력하기 위한 api',
  })
  @Post('/with/awbs')
  async createWithAwbs(
    @Body() createAircraftScheduleDto: CreateAircraftScheduleDto,
  ) {
    return await this.aircraftScheduleService.createWithAwbs(
      createAircraftScheduleDto,
    );
  }

  @ApiQuery({ name: 'Aircraft', required: false, type: 'number' })
  @ApiQuery({ name: 'CcIdDestination', required: false, type: 'number' })
  @ApiQuery({ name: 'CcIdDeparture', required: false, type: 'number' })
  @ApiQuery({ name: 'source', required: false })
  @ApiQuery({ name: 'createdAtFrom', required: false })
  @ApiQuery({ name: 'createdAtTo', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @Get()
  findAll(
    @Query('Aircraft') Aircraft?: number,
    @Query('CcIdDestination') CcIdDestination?: number,
    @Query('CcIdDeparture') CcIdDeparture?: number,
    @Query('source') source?: string,
    @Query('createdAtFrom') createdAtFrom?: Date,
    @Query('createdAtTo') createdAtTo?: Date,
    @Query('order') order?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.aircraftScheduleService.findAll(
      Aircraft,
      CcIdDestination,
      CcIdDeparture,
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
