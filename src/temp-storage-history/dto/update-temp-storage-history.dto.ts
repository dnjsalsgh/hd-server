import { PartialType } from '@nestjs/mapped-types';
import { CreateTempStorageHistoryDto } from './create-temp-storage-history.dto';

export class UpdateTempStorageHistoryDto extends PartialType(CreateTempStorageHistoryDto) {}
