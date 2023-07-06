import { Module } from '@nestjs/common';
import { CargoService } from './cargo.service';
import { CargoController } from './cargo.controller';
import { Cargo } from './entities/cargo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CargoSccJoin } from '../cargo-scc-join/entities/cargo-scc-join.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cargo, CargoSccJoin])],
  controllers: [CargoController],
  providers: [CargoService],
})
export class CargoModule {}
