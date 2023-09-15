import { PickType } from '@nestjs/swagger';
import { Alarm } from '../entities/alarm.entity';

export class CreateAlarmDto extends PickType(Alarm, [
  'equipmentName',
  'responseTime',
  'stopTime',
  'count',
]) {}
