import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { TimeTableService } from './time-table.service';
import { CreateTimeTableDto } from './dto/create-time-table.dto';
import { UpdateTimeTableDto } from './dto/update-time-table.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('time-table')
@ApiTags('time-table')
export class TimeTableController {
  constructor(private readonly timeTableService: TimeTableService) {}

  @Post()
  create(@Body() createTimeTableDto: CreateTimeTableDto) {
    return this.timeTableService.create(createTimeTableDto);
  }

  @Get()
  findAll() {
    return this.timeTableService.findAll();
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
