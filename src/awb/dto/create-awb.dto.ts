import { ApiProperty, PickType } from '@nestjs/swagger';
import { Awb } from '../entities/awb.entity';
import { Scc } from '../../scc/entities/scc.entity';
import { AircraftSchedule } from '../../aircraft-schedule/entities/aircraft-schedule.entity';

export class CreateAwbDto extends PickType(Awb, [
  'prefab',
  'waterVolume',
  'squareVolume',
  'width',
  'length',
  'depth',
  'weight',
  'barcode',
  'separateNumber',
  'destination',
  // 'source',
  'breakDown',
  'piece',
  'state',
  'parent',
  'modelPath',
  'simulation',
  // 'dataCapacity',
  // 'flight',
  // 'from',
  // 'airportArrival',
  'path',
  'spawnRatio',
  'description',
  // 'rmComment',
  // 'localTime',
  // 'localInTerminal',
  'AwbGroup',
  // 'AirCraftSchedule',
  'ghost',
  'gSkidOn',
  'awbTotalPiece',
  'allAwbReceive',
  'receivedUser',
  'receivedDate',
]) {
  @ApiProperty({
    example: '["GEN","EAT"]',
    description: 'SCCFK',
  })
  scc: Partial<Scc>[];

  @ApiProperty({
    example: 1,
    description: '항공편 FK',
  })
  AirCraftSchedule?: Partial<AircraftSchedule> | number;
}
