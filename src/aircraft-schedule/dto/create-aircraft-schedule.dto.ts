import { PickType } from '@nestjs/swagger';
import { AircraftSchedule } from '../entities/aircraft-schedule.entity';
import { Awb } from '../../awb/entities/awb.entity';

export class CreateAircraftScheduleDto extends PickType(AircraftSchedule, [
  'code',
  'source',
  'localDepartureTime',
  'koreaArrivalTime',
  'workStartTime',
  'workCompleteTargetTime',
  'koreaDepartureTime',
  'localArrivalTime',
  'waypoint',
  'Aircraft',
  'departure',
  'destination',
  'done',
  'plannedULDCount',
  'completedULDCount',
]) {
  Awbs?: Awb[];
}
