import { PartialType } from '@nestjs/mapped-types';
import { CreateAsrsHistoryDto } from './create-asrs-history.dto';

export class UpdateAsrsHistoryDto extends PartialType(CreateAsrsHistoryDto) {}
