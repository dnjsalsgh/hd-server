import { PartialType } from '@nestjs/mapped-types';
import { CreateCargoSccJoinDto } from './create-cargo-scc-join.dto';

export class UpdateCargoSccJoinDto extends PartialType(CreateCargoSccJoinDto) {}
