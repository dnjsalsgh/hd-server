import { PartialType } from '@nestjs/mapped-types';
import { CreateSimulatorHistoryDto } from './create-simulator-history.dto';

export class UpdateSimulatorHistoryDto extends PartialType(CreateSimulatorHistoryDto) {}
