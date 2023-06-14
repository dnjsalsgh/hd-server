import { PartialType } from '@nestjs/mapped-types';
import { CreateSccDto } from './create-scc.dto';

export class UpdateSccDto extends PartialType(CreateSccDto) {}
