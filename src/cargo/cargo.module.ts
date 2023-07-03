import { Module } from '@nestjs/common';
import { CargoService } from './cargo.service';
import { CargoController } from './cargo.controller';
import { Cargo } from './entities/cargo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Cargo])],
  controllers: [CargoController],
  providers: [CargoService],
})
export class CargoModule {}
