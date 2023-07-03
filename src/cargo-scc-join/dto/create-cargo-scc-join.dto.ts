import { PickType } from '@nestjs/swagger';
import { CargoSccJoin } from '../entities/cargo-scc-join.entity';

export class CreateCargoSccJoinDto extends PickType(CargoSccJoin, []) {}
