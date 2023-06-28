import { Module } from '@nestjs/common';
import { AircraftService } from './aircraft.service';
import { AircraftController } from './aircraft.controller';
import { Aircraft } from './entities/aircraft.entity';

@Module({
  imports: [Aircraft],
  controllers: [AircraftController],
  providers: [AircraftService],
})
export class AircraftModule {}
