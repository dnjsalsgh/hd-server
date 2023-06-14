import { Module } from '@nestjs/common';
import { SimulatorResultCargoJoinService } from './simulator-result-cargo-join.service';
import { SimulatorResultCargoJoinController } from './simulator-result-cargo-join.controller';

@Module({
  controllers: [SimulatorResultCargoJoinController],
  providers: [SimulatorResultCargoJoinService]
})
export class SimulatorResultCargoJoinModule {}
