import { PickType } from '@nestjs/swagger';
import { Uld } from '../entities/uld.entity';

export class CreateUldDto extends PickType(Uld, [
  'code',
  'prefab',
  'airplaneType',
  'simulation',
  'boundaryPrefab',
  'loadRate',
  'createdAt',
  'UldType',
]) {}
