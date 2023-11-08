import { PartialType } from '@nestjs/swagger';
import { CreateVmsAwbHistoryDto } from './create-vms-awb-history.dto';

export class UpdateVmsAwbHistoryDto extends PartialType(CreateVmsAwbHistoryDto) {}
