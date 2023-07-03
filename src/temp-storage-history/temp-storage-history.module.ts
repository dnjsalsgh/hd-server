import { Module } from '@nestjs/common';
import { TempStorageHistoryService } from './temp-storage-history.service';
import { TempStorageHistoryController } from './temp-storage-history.controller';
import { TempStorageHistory } from './entities/temp-storage-history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TempStorageHistory])],
  controllers: [TempStorageHistoryController],
  providers: [TempStorageHistoryService],
})
export class TempStorageHistoryModule {}
