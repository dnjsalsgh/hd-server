import { Module } from '@nestjs/common';
import { AsrsHistoryService } from './asrs-history.service';
import { AsrsHistoryController } from './asrs-history.controller';
import { AsrsHistory } from './entities/asrs-history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asrs } from '../asrs/entities/asrs.entity';
import { Awb } from '../awb/entities/awb.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AsrsHistory, Asrs, Awb])],
  controllers: [AsrsHistoryController],
  providers: [AsrsHistoryService],
})
export class AsrsHistoryModule {}
