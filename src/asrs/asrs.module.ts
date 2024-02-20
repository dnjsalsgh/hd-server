import { Module } from '@nestjs/common';
import { AsrsService } from './asrs.service';
import { AsrsController } from './asrs.controller';
import { Asrs } from './entities/asrs.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MqttModule } from '../mqtt.module';
import { AsrsHistory } from '../asrs-history/entities/asrs-history.entity';
import { TimeTable } from '../time-table/entities/time-table.entity';
import { SkidPlatformHistoryService } from '../skid-platform-history/skid-platform-history.service';
import { SkidPlatformHistory } from '../skid-platform-history/entities/skid-platform-history.entity';
import { AsrsOutOrder } from '../asrs-out-order/entities/asrs-out-order.entity';
import { Awb } from '../awb/entities/awb.entity';
import { RedisService } from '../redis/redis.service';
import { redisCustomProvider } from '../redis/redisCustomProvider';
import { AwbService } from '../awb/awb.service';
import { Scc } from '../scc/entities/scc.entity';
import { Basic } from '../basic/entities/basic.entity';
import { AwbSccJoin } from '../awb-scc-join/entities/awb-scc-join.entity';
import { AircraftSchedule } from '../aircraft-schedule/entities/aircraft-schedule.entity';
import { Vms3D } from '../vms/entities/vms.entity';
import { Vms2d } from '../vms2d/entities/vms2d.entity';
import { VmsAwbResult } from '../vms-awb-result/entities/vms-awb-result.entity';
import { VmsAwbHistory } from '../vms-awb-history/entities/vms-awb-history.entity';
import { MulterModule } from '@nestjs/platform-express';
import { FileService } from '../file/file.service';
import { MqttService } from '../mqtt.service';
import { AwbUtilService } from '../awb/awbUtil.service';
import { SccService } from '../scc/scc.service';
import { AlarmService } from '../alarm/alarm.service';
import { Alarm } from '../alarm/entities/alarm.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Asrs,
      AsrsHistory,
      TimeTable,
      SkidPlatformHistory,
      AsrsOutOrder,
      Awb,
      Scc,
      Basic,
      AwbSccJoin,
      AircraftSchedule,
      Alarm,
    ]),
    TypeOrmModule.forFeature([Vms3D, Vms2d], 'mssqlDB'),
    TypeOrmModule.forFeature([VmsAwbResult, VmsAwbHistory], 'dimoaDB'),
    MulterModule.register({ dest: './upload' }),
    // mqtt 모듈설정
    MqttModule,
  ],
  controllers: [AsrsController],
  providers: [
    AsrsService,
    SkidPlatformHistoryService,
    RedisService,
    ...redisCustomProvider,
    FileService,
    MqttService,
    AwbService,
    SccService,
    AwbUtilService,
    AlarmService,
  ],
})
export class AsrsModule {}
