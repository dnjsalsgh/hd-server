import { PickType } from '@nestjs/swagger';
import { SkidPlatform } from '../entities/skid-platform.entity';

export class CreateSkidPlatformDto extends PickType(SkidPlatform, [
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
