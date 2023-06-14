import { Module } from '@nestjs/common';
import { AmrDataService } from './amr-data.service';
import { AmrDataController } from './amr-data.controller';
import { AmrData } from './entities/amr-data.entity';

@Module({
  imports: [AmrData],
  controllers: [AmrDataController],
  providers: [AmrDataService],
})
export class AmrDataModule {}
