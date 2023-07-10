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
import * as process from 'process';
import { Amr } from '../src/amr/entities/amr.entity';
import { AmrCharger } from '../src/amr-charger/entities/amr-charger.entity';
import { AmrChargeHistory } from '../src/amr-charge-history/entities/amr-charge-history.entity';
import { Awb } from '../src/awb/entities/awb.entity';
import { Asrs } from '../src/asrs/entities/asrs.entity';
import { AwbSccJoin } from '../src/awb-scc-join/entities/awb-scc-join.entity';
import { Scc } from '../src/scc/entities/scc.entity';
import { Uld } from '../src/uld/entities/uld.entity';
import { SimulatorHistory } from '../src/simulator-history/entities/simulator-history.entity';
import { SimulatorResult } from '../src/simulator-result/entities/simulator-result.entity';
import { AsrsHistory } from '../src/asrs-history/entities/asrs-history.entity';
import { UldSccJoin } from '../src/uld-scc-join/entities/uld-scc-join.entity';
import { UldHistory } from '../src/uld-history/entities/uld-history.entity';
import { UldType } from '../src/uld-type/entities/uld-type.entity';
import { AsrsOutOrder } from '../src/asrs-out-order/entities/asrs-out-order.entity';
import { SimulatorResultAwbJoinModule } from '../src/simulator-result-awb-join/simulator-result-awb-join.module';
import { SimulatorResultAwbJoin } from '../src/simulator-result-awb-join/entities/simulator-result-awb-join.entity';
import { LoggerMiddleware } from '../src/middlewares/logger.middleware';
import { TimeTableModule } from '../src/time-table/time-table.module';
import { AircraftModule } from '../src/aircraft/aircraft.module';
import { AircraftScheduleModule } from '../src/aircraft-schedule/aircraft-schedule.module';
import { CommonCodeModule } from '../src/common-code/common-code.module';
import { AwbGroupModule } from '../src/awb-group/awb-group.module';
import { TimeTable } from '../src/time-table/entities/time-table.entity';
import { Aircraft } from '../src/aircraft/entities/aircraft.entity';
import { AircraftSchedule } from '../src/aircraft-schedule/entities/aircraft-schedule.entity';
import { CommonCode } from '../src/common-code/entities/common-code.entity';
import { AwbGroup } from '../src/awb-group/entities/awb-group.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { MqttModule } from '../src/mqtt.module';
import { BuildUpOrder } from '../src/build-up-order/entities/build-up-order.entity';
import { SkidPlatform } from '../src/skid-platform/entities/skid-platform.entity';
import { SkidPlatformHistory } from '../src/skid-platform-history/entities/skid-platform-history.entity';

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
          synchronize: process.env.NODE_ENV === 'dev', // dev 환경일 때만 true
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
