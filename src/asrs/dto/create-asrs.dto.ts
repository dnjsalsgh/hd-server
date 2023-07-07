import { PickType } from '@nestjs/swagger';
import { Asrs } from '../entities/asrs.entity';
export class CreateAsrsDto extends PickType(Asrs, [
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
