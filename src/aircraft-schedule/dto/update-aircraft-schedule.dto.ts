import { PartialType } from '@nestjs/swagger';
import { CreateAircraftScheduleDto } from './create-aircraft-schedule.dto';

export class UpdateAircraftScheduleDto extends PartialType(
  CreateAircraftScheduleDto,
) {}
