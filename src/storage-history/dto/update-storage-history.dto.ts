import { PartialType } from '@nestjs/mapped-types';
import { CreateStorageHistoryDto } from './create-storage-history.dto';

export class UpdateStorageHistoryDto extends PartialType(CreateStorageHistoryDto) {}
