import { Module } from '@nestjs/common';
import { AmrChargeHistoryService } from './amr-charge-history.service';
import { AmrChargeHistoryController } from './amr-charge-history.controller';
import { AmrChargeHistory } from './entities/amr-charge-history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AmrChargeHistory])],
  controllers: [AmrChargeHistoryController],
  providers: [AmrChargeHistoryService],
})
export class AmrChargeHistoryModule {}
