import { Module } from '@nestjs/common';
import { SimulatorResultCargoJoinService } from './simulator-result-cargo-join.service';
import { SimulatorResultCargoJoinController } from './simulator-result-cargo-join.controller';
import { SimulatorResultCargoJoin } from './entities/simulator-result-cargo-join.entity';

@Module({
  imports: [SimulatorResultCargoJoin],
  controllers: [SimulatorResultCargoJoinController],
  providers: [SimulatorResultCargoJoinService],
})
export class SimulatorResultCargoJoinModule {}
