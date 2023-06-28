import { Module } from '@nestjs/common';
import { AircraftService } from './aircraft.service';
import { AircraftController } from './aircraft.controller';
import { Aircraft } from './entities/aircraft.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Aircraft])],
  controllers: [AircraftController],
  providers: [AircraftService],
})
export class AircraftModule {}
