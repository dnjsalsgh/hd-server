import { PickType } from '@nestjs/swagger';
import { Aircraft } from '../entities/aircraft.entity';

export class CreateAircraftDto extends PickType(Aircraft, [
  'name',
  'code',
  'info',
  'allow',
  'allowDryIce',
]) {}
