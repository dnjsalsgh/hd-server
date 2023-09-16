import { Module } from '@nestjs/common';
import { AircraftScheduleService } from './aircraft-schedule.service';
import { AircraftScheduleController } from './aircraft-schedule.controller';
import { AircraftSchedule } from './entities/aircraft-schedule.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Awb } from '../awb/entities/awb.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Awb, AircraftSchedule])],
  controllers: [AircraftScheduleController],
  providers: [AircraftScheduleService],
})
export class AircraftScheduleModule {}
