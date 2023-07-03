import { Module } from '@nestjs/common';
import { SimulatorResultService } from './simulator-result.service';
import { SimulatorResultController } from './simulator-result.controller';
import { SimulatorResult } from './entities/simulator-result.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SimulatorResult])],
  controllers: [SimulatorResultController],
  providers: [SimulatorResultService],
})
export class SimulatorResultModule {}
