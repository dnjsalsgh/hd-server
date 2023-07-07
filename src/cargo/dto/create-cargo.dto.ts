import { ApiProperty, PickType } from '@nestjs/swagger';
import { Cargo } from '../entities/cargo.entity';
import { Scc } from '../../scc/entities/scc.entity';

export class CreateCargoDto extends PickType(Cargo, [
  'prefab',
  'waterVolume',
  'squareVolume',
  'width',
  'height',
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
]) {
  @ApiProperty({
    example: 1,
    description: 'SCCFK',
  })
  scc: Scc;
}
