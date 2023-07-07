import { Module } from '@nestjs/common';
import { AsrsHistoryService } from './asrs-history.service';
import { AsrsHistoryController } from './asrs-history.controller';
import { AsrsHistory } from './entities/asrs-history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AsrsHistory])],
  controllers: [AsrsHistoryController],
  providers: [AsrsHistoryService],
})
export class AsrsHistoryModule {}
