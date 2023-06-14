import { PartialType } from '@nestjs/mapped-types';
import { CreateStackerDataDto } from './create-stacker-data.dto';

export class UpdateStackerDataDto extends PartialType(CreateStackerDataDto) {}
