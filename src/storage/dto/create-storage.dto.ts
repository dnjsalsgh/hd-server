import { PickType } from '@nestjs/swagger';
import { Storage } from '../entities/storage.entity';
export class CreateStorageDto extends PickType(Storage, [
  'name',
  'parent',
  'level',
  'fullPath',
  'orderby',
  'x',
  'y',
  'z',
  'simulation',
]) {}
