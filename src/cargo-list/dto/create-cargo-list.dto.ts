import { PickType } from '@nestjs/swagger';
import { CargoList } from '../entities/cargo-list.entity';

export class CreateCargoListDto extends PickType(CargoList, [
  'name',
  'source',
  'state',
  'simulation',
]) {}
