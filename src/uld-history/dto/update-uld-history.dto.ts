import { PartialType } from '@nestjs/mapped-types';
import { CreateUldHistoryDto } from './create-uld-history.dto';

export class UpdateUldHistoryDto extends PartialType(CreateUldHistoryDto) {}
