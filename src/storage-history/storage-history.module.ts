import { Module } from '@nestjs/common';
import { StorageHistoryService } from './storage-history.service';
import { StorageHistoryController } from './storage-history.controller';
import { StorageHistory } from './entities/storage-history.entity';

@Module({
  imports: [StorageHistory],
  controllers: [StorageHistoryController],
  providers: [StorageHistoryService],
})
export class StorageHistoryModule {}
