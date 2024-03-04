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
import { AlarmService } from './alarm.service';
import { CreateAlarmDto } from './dto/create-alarm.dto';
import { UpdateAlarmDto } from './dto/update-alarm.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { Alarm } from './entities/alarm.entity';

@Controller('alarm')
@ApiTags('[알람] alarm')
export class AlarmController {
  constructor(private readonly alarmService: AlarmService) {}

  @Post()
  create(@Body() createAlarmDto: CreateAlarmDto) {
    const reuslt = this.alarmService.create(createAlarmDto);

    return reuslt;
  }

  @Get('/test')
  test() {
    return this.alarmService.test();
  }

  @ApiQuery({ name: 'createdAtFrom', required: false })
  @ApiQuery({ name: 'createdAtTo', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @Get()
  findAll(@Query() query: Alarm & BasicQueryParamDto) {
    return this.alarmService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alarmService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAlarmDto: UpdateAlarmDto) {
    return this.alarmService.update(+id, updateAlarmDto);
  }

  @Delete('/all')
  removeAll() {
    return this.alarmService.removeAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alarmService.remove(+id);
  }
}
