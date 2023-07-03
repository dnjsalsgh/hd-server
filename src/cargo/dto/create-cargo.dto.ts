import { PickType } from '@nestjs/swagger';
import { Cargo } from '../entities/cargo.entity';

export class CreateCargoDto extends PickType(Cargo, [
  'prefab',
  'waterVolume',
  'squareVolume',
  'width',
  'length',
  'height',
  'weight',
  'orthopedic',
  'barcode',
  'destination',
  'source',
  'breakDown',
  'piece',
  'state',
  'parent',
  'modelPath',
  'simulation',
]) {}
