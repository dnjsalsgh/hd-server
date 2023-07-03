import { Module } from '@nestjs/common';
import { UldHistoryService } from './uld-history.service';
import { UldHistoryController } from './uld-history.controller';
import { UldHistory } from './entities/uld-history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UldHistory])],
  controllers: [UldHistoryController],
  providers: [UldHistoryService],
})
export class UldHistoryModule {}
