import { Module } from '@nestjs/common';
import { AircraftScheduleService } from './aircraft-schedule.service';
import { AircraftScheduleController } from './aircraft-schedule.controller';
import { AircraftSchedule } from './entities/aircraft-schedule.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AircraftSchedule])],
  controllers: [AircraftScheduleController],
  providers: [AircraftScheduleService],
})
export class AircraftScheduleModule {}
