import { PickType } from '@nestjs/swagger';
import { TempStorage } from '../entities/temp-storage.entity';

export class CreateTempStorageDto extends PickType(TempStorage, [
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
