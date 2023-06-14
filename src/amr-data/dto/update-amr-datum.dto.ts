import { PartialType } from '@nestjs/mapped-types';
import { CreateAmrDatumDto } from './create-amr-datum.dto';

export class UpdateAmrDatumDto extends PartialType(CreateAmrDatumDto) {}
