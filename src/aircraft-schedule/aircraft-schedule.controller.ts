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
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('aircraft-schedule')
@ApiTags('[항공기 스케줄]aircraft-schedule')
export class AircraftScheduleController {
  constructor(
    private readonly aircraftScheduleService: AircraftScheduleService,
  ) {}

  @ApiOperation({
    summary: '항공편에 항공기, 출발지, 도착지를 FK id로 생성하기',
  })
  @Post()
  async create(@Body() createAircraftScheduleDto: CreateAircraftScheduleDto) {
    return await this.aircraftScheduleService.create(createAircraftScheduleDto);
  }

  @ApiQuery({ name: 'Aircraft', required: false, type: 'number' })
  @ApiQuery({ name: 'destination', required: false, type: 'string' })
  @ApiQuery({ name: 'departure', required: false, type: 'string' })
  @ApiQuery({ name: 'source', required: false })
  @ApiQuery({ name: 'createdAtFrom', required: false })
  @ApiQuery({ name: 'createdAtTo', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @ApiQuery({ name: 'done', required: false, type: 'boolean' })
  @Get()
  findAll(
    @Query('Aircraft') Aircraft?: number,
    @Query('destination') destination?: string,
    @Query('departure') departure?: string,
    @Query('source') source?: string,
    @Query('createdAtFrom') createdAtFrom?: Date,
    @Query('createdAtTo') createdAtTo?: Date,
    @Query('order') order?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('done') done?: boolean,
  ) {
    return this.aircraftScheduleService.findAll(
      Aircraft,
      destination,
      departure,
      source,
      createdAtFrom,
      createdAtTo,
      order,
      limit,
      offset,
      done,
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

  @ApiOperation({
    summary: '항공편 작업 상태를 변경하기 위함',
    description: '항공편 작업이 끝났다면 true, 아니면 false',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {},
    },
  })
  @Put(':id/:done')
  updateState(
    @Param('id', ParseIntPipe) id: number,
    @Param('done') done: string,
    @Body() updateAircraftScheduleDto?: UpdateAircraftScheduleDto,
  ) {
    return this.aircraftScheduleService.updateState(
      id,
      done,
      updateAircraftScheduleDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aircraftScheduleService.remove(+id);
  }
}
