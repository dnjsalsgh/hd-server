import { PartialType } from '@nestjs/swagger';
import { CreateHacsDto } from './create-hacs.dto';

export class UpdateHacsDto extends PartialType(CreateHacsDto) {}
