import { PickType } from '@nestjs/swagger';
import { StorageHistory } from '../entities/storage-history.entity';

export class CreateStorageHistoryDto extends PickType(StorageHistory, [
  'storage',
  'cargo',
]) {}
