import { PickType } from '@nestjs/swagger';
import { SimulatorResult } from '../entities/simulator-result.entity';

export class CreateSimulatorResultDto extends PickType(SimulatorResult, [
  'startDate',
  'endDate',
  'loadRate',
]) {}
