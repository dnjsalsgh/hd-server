import { ApiProperty, PickType } from '@nestjs/swagger';
import { Awb } from '../entities/awb.entity';
import { Scc } from '../../scc/entities/scc.entity';

export class CreateAwbDto extends PickType(Awb, [
  'name',
  'prefab',
  'waterVolume',
  'squareVolume',
  'width',
  'length',
  'depth',
  'weight',
  'isStructure',
  'barcode',
  'destination',
  'source',
  'breakDown',
  'piece',
  'state',
  'parent',
  'modelPath',
  'simulation',
  'dataCapacity',
  'flight',
  'from',
  'airportArrival',
  'path',
  'spawnRatio',
  'description',
  'rmComment',
  'localTime',
  'localInTerminal',
  'createdAt',
]) {
  @ApiProperty({
    example:
      '{"code": "scc-001",\n' +
      '"name": "드라이아이스",\n' +
      '"score": "1",\n' +
      '"description": "",\n' +
      '"path": ""}',
    description: 'SCCFK',
  })
  scc: Scc;
}
