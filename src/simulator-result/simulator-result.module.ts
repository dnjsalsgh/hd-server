import { Module } from '@nestjs/common';
import { SimulatorResultService } from './simulator-result.service';
import { SimulatorResultController } from './simulator-result.controller';
import { SimulatorResult } from './entities/simulator-result.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimulatorResultAwbJoin } from '../simulator-result-awb-join/entities/simulator-result-awb-join.entity';
import { SimulatorHistory } from '../simulator-history/entities/simulator-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SimulatorResult,
      SimulatorResultAwbJoin,
      SimulatorHistory,
    ]),
  ],
  controllers: [SimulatorResultController],
  providers: [SimulatorResultService],
})
export class SimulatorResultModule {}
