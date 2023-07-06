import { PartialType } from '@nestjs/swagger';
import { CreateCargoListDto } from './create-cargo-list.dto';

export class UpdateCargoListDto extends PartialType(CreateCargoListDto) {}
