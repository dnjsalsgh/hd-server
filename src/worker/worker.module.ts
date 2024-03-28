import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Amr } from '../amr/entities/amr.entity';
import { AmrCharger } from '../amr-charger/entities/amr-charger.entity';
import { AmrChargeHistory } from '../amr-charge-history/entities/amr-charge-history.entity';
import { Hacs } from '../hacs/entities/hacs.entity';
import { MqttModule } from '../mqtt.module';
import { ConfigModule } from '@nestjs/config';
import {
  amrConfig,
  dimoaConfig,
  mssqlConfig,
  postgresConfig,
} from '../config/db.config';
import { ScheduleModule } from '@nestjs/schedule';
import { HacsModule } from '../hacs/hacs.module';
import { AmrService } from '../amr/amr.service';
import { LoggerService } from '../lib/logger/logger.service';
import { Awb } from '../awb/entities/awb.entity';
import { AwbSccJoin } from '../awb-scc-join/entities/awb-scc-join.entity';
import { Scc } from '../scc/entities/scc.entity';
import { MulterModule } from '@nestjs/platform-express';
import { FileService } from '../file/file.service';
import { AwbService } from '../awb/awb.service';
import { Vms3D } from '../vms/entities/vms.entity';
import { SccService } from '../scc/scc.service';
import { Vms2d } from '../vms2d/entities/vms2d.entity';
import { AwbUtilService } from '../awb/awbUtil.service';
import { VmsAwbResult } from '../vms-awb-result/entities/vms-awb-result.entity';
import { VmsAwbHistory } from '../vms-awb-history/entities/vms-awb-history.entity';
import { AircraftSchedule } from '../aircraft-schedule/entities/aircraft-schedule.entity';
import { SkidPlatformHistory } from '../skid-platform-history/entities/skid-platform-history.entity';
import { SkidPlatformHistoryService } from '../skid-platform-history/skid-platform-history.service';
import { RedisService } from '../redis/redis.service';
import { redisCustomProvider } from '../redis/redisCustomProvider';
import { AsrsOutOrder } from '../asrs-out-order/entities/asrs-out-order.entity';
import { Alarm } from '../alarm/entities/alarm.entity';
import { AlarmService } from '../alarm/alarm.service';

@Module({
  imports: [
    //env 파일 사용
    ConfigModule.forRoot({
      isGlobal: true, // 전역으로 사용하기
    }),

    // PostgreSQL 연결 설정
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return postgresConfig;
      },
    }),

    // MSSQL 연결 설정
    TypeOrmModule.forRootAsync({
      name: 'mssqlDB',
      useFactory: async () => {
        return mssqlConfig;
      },
    }),

    // 디모아 연결 설정
    TypeOrmModule.forRootAsync({
      name: 'dimoaDB',
      useFactory: async () => {
        return dimoaConfig;
      },
    }),

    // amr업체 연결 설정
    TypeOrmModule.forRootAsync({
      name: 'amrDB',
      useFactory: async () => {
        return amrConfig;
      },
    }),

    // mqtt 모듈설정
    MqttModule,

    // schedule 모듈 설정
    ScheduleModule.forRoot(),

    // file 모듈 설정
    // FileModule,

    HacsModule,
    WorkerModule,
    TypeOrmModule.forFeature([
      Amr,
      AmrCharger,
      AmrChargeHistory,
      Awb,
      AwbSccJoin,
      Scc,
      AsrsOutOrder,
      AircraftSchedule,
      SkidPlatformHistory,
      Alarm,
    ]),
    TypeOrmModule.forFeature([Vms3D, Vms2d], 'mssqlDB'),
    TypeOrmModule.forFeature([VmsAwbResult, VmsAwbHistory], 'dimoaDB'),
    TypeOrmModule.forFeature([Hacs], 'amrDB'),
    MulterModule.register({ dest: './upload' }),
  ],
  providers: [
    WorkerService,
    AmrService,
    LoggerService,
    {
      provide: 'SERVICE_NAME', // 여기에서 프로바이더 이름을 지정합니다.
      useValue: 'WorkerService', // 원하는 값을 useValue로 지정합니다.
    },
    FileService,

    AwbService,
    AwbUtilService,
    SccService,
    SkidPlatformHistoryService,
    RedisService,
    ...redisCustomProvider,
    AlarmService,
  ],
})
export class WorkerModule {}
