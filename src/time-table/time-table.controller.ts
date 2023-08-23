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
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { BasicqueryparamDto } from '../lib/dto/basicqueryparam.dto';
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
  @ApiQuery({ name: 'createdAtFrom', required: false })
  @ApiQuery({ name: 'createdAtTo', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @Get()
  findAll(@Query() query: TimeTable & BasicqueryparamDto) {
    return this.timeTableService.findAll(query);
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
