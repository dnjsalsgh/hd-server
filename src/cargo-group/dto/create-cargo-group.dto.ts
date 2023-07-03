import { PickType } from '@nestjs/swagger';
import { CargoGroup } from '../entities/cargo-group.entity';

export class CreateCargoGroupDto extends PickType(CargoGroup, [
  'name',
  'code',
]) {}
