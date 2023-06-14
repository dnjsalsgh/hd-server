import { Module } from '@nestjs/common';
import { SimulatorHistoryService } from './simulator-history.service';
import { SimulatorHistoryController } from './simulator-history.controller';
import { SimulatorHistory } from './entities/simulator-history.entity';

@Module({
  imports: [SimulatorHistory],
  controllers: [SimulatorHistoryController],
  providers: [SimulatorHistoryService],
})
export class SimulatorHistoryModule {}
