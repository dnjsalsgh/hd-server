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
import { TimeTableService } from './time-table.service';
import { CreateTimeTableDto } from './dto/create-time-table.dto';
import { UpdateTimeTableDto } from './dto/update-time-table.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { TimeTable } from './entities/time-table.entity';

@Controller('time-table')
@ApiTags('[타임 테이블]time-table')
export class TimeTableController {
  constructor(private readonly timeTableService: TimeTableService) {}

  @Post()
  create(@Body() createTimeTableDto: CreateTimeTableDto) {
    return this.timeTableService.create(createTimeTableDto);
  }

  @ApiQuery({ name: 'Uld', required: false, type: 'number' })
  @ApiQuery({ name: 'Amr', required: false, type: 'number' })
  @ApiQuery({ name: 'Awb', required: false, type: 'number' })
  @ApiQuery({ name: 'AircraftSchedule', required: false, type: 'number' })
  @ApiQuery({ name: 'createdAtFrom', required: false })
  @ApiQuery({ name: 'createdAtTo', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @Get()
  findAll(@Query() query: TimeTable & BasicQueryParamDto) {
    return this.timeTableService.findAll(query);
  }

  @ApiOperation({
    summary: '기간 검색 후 항공편만 보이게 설정한 api',
    description: '기간 검색 후 항공편만 보이게 설정',
  })
  @ApiQuery({ name: 'AircraftSchedule', required: false, type: 'number' })
  @ApiQuery({ name: 'createdAtFrom', required: false })
  @ApiQuery({ name: 'createdAtTo', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @Get('/only-aircraft-schedule')
  findAllOnlyAircraftSchedule(@Query() query: TimeTable & BasicQueryParamDto) {
    return this.timeTableService.findAllOnlyAircraftSchedule(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timeTableService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTimeTableDto: UpdateTimeTableDto,
  ) {
    return this.timeTableService.update(+id, updateTimeTableDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timeTableService.remove(+id);
  }
}
