import { ApiProperty, PickType } from '@nestjs/swagger';
import { AwbGroup } from '../entities/awb-group.entity';
import { Awb } from '../../awb/entities/awb.entity';

export class CreateAwbGroupDto extends PickType(AwbGroup, ['code']) {
  @ApiProperty({
    example:
      '[{\n' +
      '  "name": "화물-001",\n' +
      '  "prefab": "3d Model Name",\n' +
      '  "waterVolume": 1,\n' +
      '  "squareVolume": 1,\n' +
      '  "width": 1,\n' +
      '  "length": 1,\n' +
      '  "depth": 1,\n' +
      '  "weight": 1,\n' +
      '  "isStructure": true,\n' +
      '  "barcode": "010101",\n' +
      '  "destination": "USA",\n' +
      '  "source": "한국",\n' +
      '  "breakDown": false,\n' +
      '  "piece": 1,\n' +
      '  "state": "saved",\n' +
      '  "parent": 0,\n' +
      '  "modelPath": "",\n' +
      '  "simulation": true,\n' +
      '  "dataCapacity": 1,\n' +
      '  "flight": "fly",\n' +
      '  "from": "출발지",\n' +
      '  "airportArrival": "공항도착",\n' +
      '  "path": "/c/file/xxx",\n' +
      '  "spawnRatio": 1,\n' +
      '  "description": "배송설명",\n' +
      '  "rmComment": "RM 코멘트",\n' +
      '  "localTime": "2023-07-12",\n' +
      '  "localInTerminal": "AIR-001",\n' +
      '  "scc": [\n' +
      '    "GEN",\n' +
      '    "EAT"\n' +
      '  ],\n' +
      '  "aircraftName": "test",\n' +
      '  "aircraftCode": "2023-08-28T06:28:38.181Z",\n' +
      '  "aircraftInfo": {\n' +
      '    "test": "test"\n' +
      '  },\n' +
      '  "allow": true,\n' +
      '  "allowDryIce": true,\n' +
      '  "localDepartureTime": "2023-08-28T06:28:38.181Z",\n' +
      '  "koreaArrivalTime": "2023-08-28T06:28:38.181Z",\n' +
      '  "workStartTime": "2023-08-28T06:28:38.181Z",\n' +
      '  "workCompleteTargetTime": "2023-08-28T06:28:38.181Z",\n' +
      '  "koreaDepartureTime": "2023-08-28T06:28:38.181Z",\n' +
      '  "localArrivalTime": "2023-08-28T06:28:38.181Z",\n' +
      '  "waypoint": [\n' +
      '    "GEN",\n' +
      '    "TEL",\n' +
      '    "QRL"\n' +
      '  ],\n' +
      '  "departure": "KOR"\n' +
      '}]',
    description: 'SCCFK',
  })
  awbs?: Awb[];
}
