import { Module } from '@nestjs/common';
import { SimulatorHistoryService } from './simulator-history.service';
import { SimulatorHistoryController } from './simulator-history.controller';
import { SimulatorHistory } from './entities/simulator-history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SimulatorHistory])],
  controllers: [SimulatorHistoryController],
  providers: [SimulatorHistoryService],
})
export class SimulatorHistoryModule {}
