import { PickType } from '@nestjs/swagger';
import { UldType } from '../entities/uld-type.entity';

export class CreateUldTypeDto extends PickType(UldType, [
  'code',
  'name',
  'waterVolume',
  'squareVolume',
  'width',
  'length',
  'height',
  'capacity',
  'modelPath',
  'vertexCord',
]) {}
