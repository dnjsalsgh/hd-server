import { PartialType } from '@nestjs/mapped-types';
import { CreateAmrChargerDto } from './create-amr-charger.dto';

export class UpdateAmrChargerDto extends PartialType(CreateAmrChargerDto) {}
