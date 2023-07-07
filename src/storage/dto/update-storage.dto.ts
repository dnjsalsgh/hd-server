import { PartialType } from '@nestjs/mapped-types';
import { CreateStorageDto } from './create-storage.dto';
import { PickType } from '@nestjs/swagger';
import { Storage } from '../entities/storage.entity';
export class UpdateStorageDto extends PickType(Storage, [
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
