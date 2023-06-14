import { PartialType } from '@nestjs/mapped-types';
import { CreateUldTypeDto } from './create-uld-type.dto';

export class UpdateUldTypeDto extends PartialType(CreateUldTypeDto) {}
