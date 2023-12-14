import { Module } from '@nestjs/common';
import { AwbService } from './awb.service';
import { AwbController } from './awb.controller';
import { Awb } from './entities/awb.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwbSccJoin } from '../awb-scc-join/entities/awb-scc-join.entity';
import { MulterModule } from '@nestjs/platform-express';
import { Scc } from '../scc/entities/scc.entity';
import { MqttModule } from '../mqtt.module';
import { FileService } from '../file/file.service';
import { Vms3D } from '../vms/entities/vms.entity';
import { MqttService } from '../mqtt.service';
import { SccService } from '../scc/scc.service';
import { Vms2d } from '../vms2d/entities/vms2d.entity';
import { Basic } from '../basic/entities/basic.entity';
import { AwbUtilService } from './awbUtil.service';
import { VmsAwbResult } from '../vms-awb-result/entities/vms-awb-result.entity';
import { VmsAwbHistory } from '../vms-awb-history/entities/vms-awb-history.entity';
import { AircraftSchedule } from '../aircraft-schedule/entities/aircraft-schedule.entity';
import { SkidPlatformHistory } from '../skid-platform-history/entities/skid-platform-history.entity';
import { SkidPlatformHistoryService } from '../skid-platform-history/skid-platform-history.service';
import { AsrsOutOrder } from '../asrs-out-order/entities/asrs-out-order.entity';
import { RedisService } from '../redis/redis.service';
import { redisCustomProvider } from '../redis/redisCustomProvider';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Awb,
      Scc,
      Basic,
      AwbSccJoin,
      AsrsOutOrder,
      AircraftSchedule,
      SkidPlatformHistory,
    ]),
    TypeOrmModule.forFeature([Vms3D, Vms2d], 'mssqlDB'),
    TypeOrmModule.forFeature([VmsAwbResult, VmsAwbHistory], 'dimoaDB'),
    MulterModule.register({ dest: './upload' }),
    // mqtt 모듈설정
    MqttModule,
  ],
  controllers: [AwbController],
  providers: [
    AwbService,
    AwbUtilService,
    FileService,
    MqttService,
    SccService,
    SkidPlatformHistoryService,
    RedisService,
    ...redisCustomProvider,
  ],
})
export class AwbModule {}
