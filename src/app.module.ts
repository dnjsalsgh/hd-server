import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AmrModule } from './amr/amr.module';
import { AmrChargerModule } from './amr-charger/amr-charger.module';
import { AmrChargeHistoryModule } from './amr-charge-history/amr-charge-history.module';
import { AsrsModule } from './asrs/asrs.module';
import { AwbModule } from './awb/awb.module';
import { AwbSccJoinModule } from './awb-scc-join/awb-scc-join.module';
import { SccModule } from './scc/scc.module';
import { UldModule } from './uld/uld.module';
import { UldHistoryModule } from './uld-history/uld-history.module';
import { UldSccJoinModule } from './uld-scc-join/uld-scc-join.module';
import { UldTypeModule } from './uld-type/uld-type.module';
import { AsrsOutOrderModule } from './asrs-out-order/asrs-out-order.module';
import { BuildUpOrderModule } from './build-up-order/build-up-order.module';
import { SkidPlatformModule } from './skid-platform/skid-platform.module';
import { SkidPlatformHistoryModule } from './skid-platform-history/skid-platform-history.module';
import { AsrsHistoryModule } from './asrs-history/asrs-history.module';
import { SimulatorResultModule } from './simulator-result/simulator-result.module';
import { SimulatorHistoryModule } from './simulator-history/simulator-history.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimulatorResultAwbJoinModule } from './simulator-result-awb-join/simulator-result-awb-join.module';
import { LoggerMiddleware } from './lib/logger/logger.middleware';
import { TimeTableModule } from './time-table/time-table.module';
import { AircraftModule } from './aircraft/aircraft.module';
import { AircraftScheduleModule } from './aircraft-schedule/aircraft-schedule.module';
import { CommonCodeModule } from './common-code/common-code.module';
import { AwbGroupModule } from './awb-group/awb-group.module';
import { MqttModule } from './mqtt.module';
import { RedisCacheModule } from './cache/redis.module';
import { ScheduleModule } from '@nestjs/schedule';
import { FileModule } from './file/file.module';
import { mssqlConfig, postgresConfig } from './config/db.config';
import { VmsModule } from './vms/vms.module';
import { HacsModule } from './hacs/hacs.module';

@Module({
  imports: [
    //env 파일 사용
    ConfigModule.forRoot({
      isGlobal: true, // 전역으로 사용하기
    }),

    // DB 연결
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
    AmrModule,
    AmrChargerModule,
    AmrChargeHistoryModule,
    AsrsModule,
    AwbModule,
    AwbSccJoinModule,
    SccModule,
    UldModule,
    UldHistoryModule,
    UldSccJoinModule,
    UldTypeModule,
    AsrsOutOrderModule,
    BuildUpOrderModule,
    SkidPlatformModule,
    SkidPlatformHistoryModule,
    AsrsHistoryModule,
    SimulatorResultModule,
    SimulatorHistoryModule,
    SimulatorResultAwbJoinModule,
    TimeTableModule,
    AircraftModule,
    AircraftScheduleModule,
    CommonCodeModule,
    AwbGroupModule,
    // mssql의 vms 테이블 설정
    VmsModule,
    // mqtt 모듈설정
    MqttModule,

    // redis 모듈설정
    RedisCacheModule,

    // schedule 모듈 설정
    ScheduleModule.forRoot(),

    // file 모듈 설정
    FileModule,

    HacsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
