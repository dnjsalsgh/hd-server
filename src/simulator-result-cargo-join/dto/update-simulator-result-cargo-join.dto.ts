import { PartialType } from '@nestjs/swagger';
import { CreateSimulatorResultCargoJoinDto } from './create-simulator-result-cargo-join.dto';

export class UpdateSimulatorResultCargoJoinDto extends PartialType(CreateSimulatorResultCargoJoinDto) {}
