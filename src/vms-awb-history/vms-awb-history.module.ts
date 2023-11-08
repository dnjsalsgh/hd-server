import { Module } from '@nestjs/common';
import { VmsAwbHistoryService } from './vms-awb-history.service';
import { VmsAwbHistoryController } from './vms-awb-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VmsAwbHistory } from './entities/vms-awb-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VmsAwbHistory], 'dimoaDB')],
  controllers: [VmsAwbHistoryController],
  providers: [VmsAwbHistoryService],
  exports: [VmsAwbHistoryModule],
})
export class VmsAwbHistoryModule {}
