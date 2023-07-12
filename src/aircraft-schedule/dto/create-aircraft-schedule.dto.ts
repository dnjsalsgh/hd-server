import { ApiProperty, PickType } from '@nestjs/swagger';
import { Aircraft } from '../../aircraft/entities/aircraft.entity';
import { CommonCode } from '../../common-code/entities/common-code.entity';
import { AircraftSchedule } from '../entities/aircraft-schedule.entity';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { Column } from 'typeorm';

export class CreateAircraftScheduleDto extends PickType(AircraftSchedule, [
  'source',
  'localDepartureTime',
  'koreaArrivalTime',
  'workStartTime',
  'workCompleteTargetTime',
  'koreaDepartureTime',
  'localArrivalTime',
  'waypoint',
  'Aircraft',
  'CcIdDestination',
  'CcIdDeparture',
]) {
  // @ApiProperty({
  //   example: 'GEN',
  //   description: '출처',
  // })
  // source: string;
  // @ApiProperty({
  //   example: '4',
  //   description: '항공기 FK',
  // })
  // Aircraft: Aircraft;
  // @ApiProperty({
  //   example: '31',
  //   description: '공통코드 FK',
  // })
  // CcIdDestination: CommonCode;
  // @ApiProperty({
  //   example: '1',
  //   description: '항공기Id',
  // })
  // aircraft: number;
}
