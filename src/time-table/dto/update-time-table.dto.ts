import { PartialType } from '@nestjs/swagger';
import { CreateTimeTableDto } from './create-time-table.dto';

export class UpdateTimeTableDto extends PartialType(CreateTimeTableDto) {}
