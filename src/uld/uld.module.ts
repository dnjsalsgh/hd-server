import { Module } from '@nestjs/common';
import { UldService } from './uld.service';
import { UldController } from './uld.controller';
import { Uld } from './entities/uld.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UldSccJoin } from '../uld-scc-join/entities/uld-scc-join.entity';
import { UldType } from '../uld-type/entities/uld-type.entity';
import { MqttModule } from '../mqtt.module';
import { AircraftSchedule } from '../aircraft-schedule/entities/aircraft-schedule.entity';
import { UldHistory } from '../uld-history/entities/uld-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Uld,
      UldType,
      UldSccJoin,
      AircraftSchedule,
      UldHistory,
    ]),
    // mqtt 모듈설정
    MqttModule,
  ],
  controllers: [UldController],
  providers: [UldService],
})
export class UldModule {}
