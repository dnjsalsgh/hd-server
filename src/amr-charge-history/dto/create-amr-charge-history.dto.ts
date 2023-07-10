import { PickType } from '@nestjs/swagger';
import { AmrChargeHistory } from '../entities/amr-charge-history.entity';

export class CreateAmrChargeHistoryDto extends PickType(AmrChargeHistory, [
  'chargeStart',
  'chargeEnd',
  'soc',
  'soh',
  'amr',
  'amrCharger',
]) {}
