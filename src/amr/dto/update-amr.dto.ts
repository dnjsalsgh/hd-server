import { PartialType } from '@nestjs/mapped-types';
import { CreateAmrDto } from './create-amr.dto';

export class UpdateAmrDto extends PartialType(CreateAmrDto) {}
