import { PartialType } from '@nestjs/swagger';
import { CreateCargoGroupDto } from './create-cargo-group.dto';

export class UpdateCargoGroupDto extends PartialType(CreateCargoGroupDto) {}
