import { PickType } from '@nestjs/swagger';
import { UldHistory } from '../entities/uld-history.entity';

export class CreateUldHistoryDto extends PickType(UldHistory, [
  'x',
  'y',
  'z',
  'pieceCount',
  'recommend',
  'worker',
  'BuildUpOrder',
]) {}
