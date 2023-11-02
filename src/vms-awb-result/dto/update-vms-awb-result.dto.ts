import { PartialType } from '@nestjs/swagger';
import { CreateVmsAwbResultDto } from './create-vms-awb-result.dto';

export class UpdateVmsAwbResultDto extends PartialType(CreateVmsAwbResultDto) {}
