import { Module } from '@nestjs/common';
import { SimulatorResultAwbJoinService } from './simulator-result-awb-join.service';
import { SimulatorResultAwbJoinController } from './simulator-result-awb-join.controller';
import { SimulatorResultAwbJoin } from './entities/simulator-result-awb-join.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SimulatorResultAwbJoin])],
  controllers: [SimulatorResultAwbJoinController],
  providers: [SimulatorResultAwbJoinService],
})
export class SimulatorResultAwbJoinModule {}
