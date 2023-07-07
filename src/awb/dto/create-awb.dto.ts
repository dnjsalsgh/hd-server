import { ApiProperty, PickType } from '@nestjs/swagger';
import { Awb } from '../entities/awb.entity';
import { Scc } from '../../scc/entities/scc.entity';

export class CreateAwbDto extends PickType(Awb, [
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
