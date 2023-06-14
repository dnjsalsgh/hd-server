import { Module } from '@nestjs/common';
import { AmrChargeHistoryService } from './amr-charge-history.service';
import { AmrChargeHistoryController } from './amr-charge-history.controller';
import { AmrChargeHistory } from './entities/amr-charge-history.entity';

@Module({
  imports: [AmrChargeHistory],
  controllers: [AmrChargeHistoryController],
  providers: [AmrChargeHistoryService],
})
export class AmrChargeHistoryModule {}
