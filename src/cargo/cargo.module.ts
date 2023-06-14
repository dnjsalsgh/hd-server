import { Module } from '@nestjs/common';
import { CargoService } from './cargo.service';
import { CargoController } from './cargo.controller';
import { Cargo } from './entities/cargo.entity';

@Module({
  imports: [Cargo],
  controllers: [CargoController],
  providers: [CargoService],
})
export class CargoModule {}
