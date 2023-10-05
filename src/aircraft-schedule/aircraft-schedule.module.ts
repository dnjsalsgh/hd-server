import { Module } from '@nestjs/common';
import { AircraftScheduleService } from './aircraft-schedule.service';
import { AircraftScheduleController } from './aircraft-schedule.controller';
import { AircraftSchedule } from './entities/aircraft-schedule.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Awb } from '../awb/entities/awb.entity';
import { MqttModule } from '../mqtt.module';
import { UldService } from '../uld/uld.service';
import { UldType } from '../uld-type/entities/uld-type.entity';
import { Uld } from '../uld/entities/uld.entity';
import { UldSccJoin } from '../uld-scc-join/entities/uld-scc-join.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Awb, AircraftSchedule, UldType, Uld, UldSccJoin]),
    // mqtt 모듈설정
    MqttModule,
  ],
  controllers: [AircraftScheduleController],
  providers: [AircraftScheduleService],
})
export class AircraftScheduleModule {}
