import { Module } from '@nestjs/common';
import { CargoSccJoinService } from './cargo-scc-join.service';
import { CargoSccJoinController } from './cargo-scc-join.controller';
import { CargoSccJoin } from './entities/cargo-scc-join.entity';

@Module({
  imports: [CargoSccJoin],
  controllers: [CargoSccJoinController],
  providers: [CargoSccJoinService],
})
export class CargoSccJoinModule {}
