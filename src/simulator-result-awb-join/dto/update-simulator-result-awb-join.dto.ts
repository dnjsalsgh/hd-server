import { PartialType } from '@nestjs/swagger';
import { CreateSimulatorResultAwbJoinDto } from './create-simulator-result-awb-join.dto';

export class UpdateSimulatorResultAwbJoinDto extends PartialType(
  CreateSimulatorResultAwbJoinDto,
) {}
