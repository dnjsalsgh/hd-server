import { PartialType } from '@nestjs/mapped-types';
import { CreateAmrChargeHistoryDto } from './create-amr-charge-history.dto';

export class UpdateAmrChargeHistoryDto extends PartialType(CreateAmrChargeHistoryDto) {}
