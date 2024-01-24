import { forwardRef, Module } from '@nestjs/common';
import { SkidPlatformHistoryService } from './skid-platform-history.service';
import { SkidPlatformHistoryController } from './skid-platform-history.controller';
import { SkidPlatformHistory } from './entities/skid-platform-history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsrsOutOrder } from '../asrs-out-order/entities/asrs-out-order.entity';
import { MqttModule } from '../mqtt.module';
import { RedisService } from '../redis/redis.service';
import { redisCustomProvider } from '../redis/redisCustomProvider';
import { Awb } from '../awb/entities/awb.entity';
import { AwbService } from '../awb/awb.service';
import { Scc } from '../scc/entities/scc.entity';
import { Vms3D } from '../vms/entities/vms.entity';
import { Vms2d } from '../vms2d/entities/vms2d.entity';
import { VmsAwbResult } from '../vms-awb-result/entities/vms-awb-result.entity';
import { VmsAwbHistory } from '../vms-awb-history/entities/vms-awb-history.entity';
import { FileService } from '../file/file.service';
import { SccService } from '../scc/scc.service';
import { AwbUtilService } from '../awb/awbUtil.service';
import { Basic } from '../basic/entities/basic.entity';
import { AircraftSchedule } from '../aircraft-schedule/entities/aircraft-schedule.entity';
import { AwbSccJoin } from '../awb-scc-join/entities/awb-scc-join.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SkidPlatformHistory,
      AsrsOutOrder,
      Awb,
      Scc,
      Basic,
      AwbSccJoin,
      AircraftSchedule,
    ]),
    TypeOrmModule.forFeature([Vms3D, Vms2d], 'mssqlDB'),
    TypeOrmModule.forFeature([VmsAwbResult, VmsAwbHistory], 'dimoaDB'),
    MqttModule,
  ],
  controllers: [SkidPlatformHistoryController],
  providers: [
    SkidPlatformHistoryService,
    RedisService,
    ...redisCustomProvider,
    AwbService,
    FileService,
    SccService,
    AwbUtilService,
  ],
})
export class SkidPlatformHistoryModule {}
