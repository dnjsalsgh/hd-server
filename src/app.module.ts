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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Amr } from './amr/entities/amr.entity';
import { AmrCharger } from './amr-charger/entities/amr-charger.entity';
import { AmrChargeHistory } from './amr-charge-history/entities/amr-charge-history.entity';
import { Awb } from './awb/entities/awb.entity';
import { Asrs } from './asrs/entities/asrs.entity';
import { AwbSccJoin } from './awb-scc-join/entities/awb-scc-join.entity';
import { Scc } from './scc/entities/scc.entity';
import { Uld } from './uld/entities/uld.entity';
import { SimulatorHistory } from './simulator-history/entities/simulator-history.entity';
import { SimulatorResult } from './simulator-result/entities/simulator-result.entity';
import { AsrsHistory } from './asrs-history/entities/asrs-history.entity';
import { UldSccJoin } from './uld-scc-join/entities/uld-scc-join.entity';
import { UldHistory } from './uld-history/entities/uld-history.entity';
import { UldType } from './uld-type/entities/uld-type.entity';
import { AsrsOutOrder } from './asrs-out-order/entities/asrs-out-order.entity';
import { SimulatorResultAwbJoinModule } from './simulator-result-awb-join/simulator-result-awb-join.module';
import { SimulatorResultAwbJoin } from './simulator-result-awb-join/entities/simulator-result-awb-join.entity';
import { LoggerMiddleware } from './lib/logger/logger.middleware';
import { TimeTableModule } from './time-table/time-table.module';
import { AircraftModule } from './aircraft/aircraft.module';
import { AircraftScheduleModule } from './aircraft-schedule/aircraft-schedule.module';
import { CommonCodeModule } from './common-code/common-code.module';
import { AwbGroupModule } from './awb-group/awb-group.module';
import { TimeTable } from './time-table/entities/time-table.entity';
import { Aircraft } from './aircraft/entities/aircraft.entity';
import { AircraftSchedule } from './aircraft-schedule/entities/aircraft-schedule.entity';
import { CommonCode } from './common-code/entities/common-code.entity';
import { AwbGroup } from './awb-group/entities/awb-group.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { MqttModule } from './mqtt.module';
import { BuildUpOrder } from './build-up-order/entities/build-up-order.entity';
import { SkidPlatform } from './skid-platform/entities/skid-platform.entity';
import { SkidPlatformHistory } from './skid-platform-history/entities/skid-platform-history.entity';
import { RedisCacheModule } from './cache/redis.module';

@Module({
  imports: [
    //env 파일 사용
    ConfigModule.forRoot({
      isGlobal: true, // 전역으로 사용하기
    }),

    // DB 연결
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> => {
        return {
          type: 'postgres',
          host: configService.getOrThrow('DATABASE_HOST'),
          port: configService.getOrThrow('DATABASE_PORT'),
          username: configService.getOrThrow('DATABASE_USER'),
          password: configService.getOrThrow('DATABASE_PASS'),
          database: configService.getOrThrow('DATABASE_NAME'),
          entities: [
            Amr,
            AmrCharger,
            AmrChargeHistory,
            Asrs,
            Awb,
            AwbSccJoin,
            Scc,
            Uld,
            UldHistory,
            UldSccJoin,
            UldType,
            AsrsOutOrder,
            BuildUpOrder,
            SkidPlatform,
            SkidPlatformHistory,
            AsrsHistory,
            SimulatorResult,
            SimulatorHistory,
            SimulatorResultAwbJoin,
            TimeTable,
            Aircraft,
            AircraftSchedule,
            CommonCode,
            AwbGroup,
          ],
          // autoLoadEntities: true,  [버그있어서 사용 지양]
          logging: true, // 쿼리 보여주는 옵션
          // synchronize: process.env.NODE_ENV === 'dev', // dev 환경일 때만 true
          namingStrategy: new SnakeNamingStrategy(), // db column을 snake_case로 변경
        };
      },
      inject: [ConfigService],
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
    // mqtt 모듈설정
    MqttModule,

    // redis 모듈설정
    RedisCacheModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
