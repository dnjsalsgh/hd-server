import { PickType } from '@nestjs/swagger';

export class CreateStorageDto extends PickType(Storage, [
  'name',
  'fullPath',
  'orderby',
  'x',
  'y',
  'z',
  'simulation',
]) {}
