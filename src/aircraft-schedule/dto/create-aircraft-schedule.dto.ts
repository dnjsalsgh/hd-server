import { ApiProperty, PickType } from '@nestjs/swagger';
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
]) {
  // @ApiProperty({
  //   example:
  //     '[{\n' +
  //     '  "name": "화물-001",\n' +
  //     '  "prefab": "3d Model Name",\n' +
  //     '  "waterVolume": 1,\n' +
  //     '  "squareVolume": 1,\n' +
  //     '  "width": 1,\n' +
  //     '  "length": 1,\n' +
  //     '  "depth": 1,\n' +
  //     '  "weight": 1,\n' +
  //     '  "isStructure": true,\n' +
  //     '  "barcode": "010101",\n' +
  //     '  "destination": "미국",\n' +
  //     '  "source": "한국",\n' +
  //     '  "breakDown": false,\n' +
  //     '  "piece": 1,\n' +
  //     '  "state": "saved",\n' +
  //     '  "parent": 0,\n' +
  //     '  "modelPath": null,\n' +
  //     '  "simulation": true,\n' +
  //     '  "dataCapacity": 1,\n' +
  //     '  "flight": "fly",\n' +
  //     '  "from": "출발지",\n' +
  //     '  "airportArrival": "공항도착",\n' +
  //     '  "path": null,\n' +
  //     '  "spawnRatio": 1,\n' +
  //     '  "description": "배송설명",\n' +
  //     '  "rmComment": "RM 코멘트",\n' +
  //     '  "localTime": "2023-07-12",\n' +
  //     '  "localInTerminal": "AIR-001",\n' +
  //     '  "scc": [\n' +
  //     '    "GEN",\n' +
  //     '    "EAT"\n' +
  //     '  ]\n' +
  //     '}]',
  //   description: '입력된 화물들',
  // })
  Awbs?: Awb[];
}
