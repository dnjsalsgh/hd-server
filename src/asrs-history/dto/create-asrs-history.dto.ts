import { PickType } from '@nestjs/swagger';
import { AsrsHistory } from '../entities/asrs-history.entity';

export class CreateAsrsHistoryDto extends PickType(AsrsHistory, [
  'Asrs',
  'Awb',
]) {}
