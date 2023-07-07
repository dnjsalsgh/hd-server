import { Module } from '@nestjs/common';
import { SimulatorResultCargoJoinService } from './simulator-result-cargo-join.service';
import { SimulatorResultCargoJoinController } from './simulator-result-cargo-join.controller';
import { SimulatorResultAwbJoin } from './entities/simulator-result-awb-join.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SimulatorResultAwbJoin])],
  controllers: [SimulatorResultCargoJoinController],
  providers: [SimulatorResultCargoJoinService],
})
export class SimulatorResultAwbJoinModule {}
