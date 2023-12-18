import { ApiProperty, PickType } from '@nestjs/swagger';
import { Awb } from '../entities/awb.entity';
import { Scc } from '../../scc/entities/scc.entity';

export class PrepareBreakDownAwbInputDto extends PickType(Awb, [
  'prefab',
  'waterVolume',
  'squareVolume',
  'width',
  'length',
  'depth',
  'weight',
  'barcode',
  'separateNumber',
  'piece',
  'state',
  'parent',
  'modelPath',
  'simulation',
  'destination',
  'path',
  'spawnRatio',
  'description',
  'ghost',
  'gSkidOn',
  'awbTotalPiece',
  'allAwbReceive',
  'receivedUser',
  'receivedDate',
]) {
  @ApiProperty({
    example: 1,
    description: '화물의 id',
  })
  id: number;

  @ApiProperty({
    example: '["GEN","EAT"]',
    description: 'SCCFK',
  })
  scc: Partial<Scc>[];

  @ApiProperty({
    example: 1,
    description: '안착대 FK',
  })
  SkidPlatform?: number;

  // @ApiProperty({
  //   example: 1,
  //   description: '항공편 FK',
  // })
  // AirCraftSchedule?: Partial<AircraftSchedule>;
}
