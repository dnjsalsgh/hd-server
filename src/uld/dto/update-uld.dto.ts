import { PartialType } from '@nestjs/mapped-types';
import { CreateUldDto } from './create-uld.dto';

export class UpdateUldDto extends PartialType(CreateUldDto) {}
