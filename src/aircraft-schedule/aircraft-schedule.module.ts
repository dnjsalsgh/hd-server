import { Module } from '@nestjs/common';
import { AircraftScheduleService } from './aircraft-schedule.service';
import { AircraftScheduleController } from './aircraft-schedule.controller';
import { AircraftSchedule } from './entities/aircraft-schedule.entity';

@Module({
  imports: [AircraftSchedule],
  controllers: [AircraftScheduleController],
  providers: [AircraftScheduleService],
})
export class AircraftScheduleModule {}
