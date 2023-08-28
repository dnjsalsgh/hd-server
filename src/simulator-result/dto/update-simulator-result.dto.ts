import { PartialType } from '@nestjs/mapped-types';
import { CreateSimulatorResultDto } from './create-simulator-result.dto';

export class UpdateSimulatorResultDto extends PartialType(
  CreateSimulatorResultDto,
) {}
