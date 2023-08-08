import { PickType } from '@nestjs/swagger';
import { Scc } from '../entities/scc.entity';

export class CreateSccDto extends PickType(Scc, [
  'code',
  'name',
  'score',
  'description',
  'path',
  'banList',
]) {}
