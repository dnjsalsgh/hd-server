import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AmrModule } from './amr/amr.module';
import { AmrChargerModule } from './amr-charger/amr-charger.module';
import { AmrChargeHistoryModule } from './amr-charge-history/amr-charge-history.module';
import { StorageModule } from './storage/storage.module';
import { CargoModule } from './cargo/cargo.module';
import { CargoSccJoinModule } from './cargo-scc-join/cargo-scc-join.module';
import { SccModule } from './scc/scc.module';
import { UldModule } from './uld/uld.module';
import { UldHistoryModule } from './uld-history/uld-history.module';
import { UldSccJoinModule } from './uld-scc-join/uld-scc-join.module';
import { UldTypeModule } from './uld-type/uld-type.module';
import { StorageWorkOrderModule } from './storage-work-order/storage-work-order.module';
import { InspectWorkOrderModule } from './inspect-work-order/inspect-work-order.module';
import { TempStorageModule } from './temp-storage/temp-storage.module';
import { TempStorageHistoryModule } from './temp-storage-history/temp-storage-history.module';
import { StorageHistoryModule } from './storage-history/storage-history.module';
import { SimulatorResultModule } from './simulator-result/simulator-result.module';
import { SimulatorHistoryModule } from './simulator-history/simulator-history.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as process from 'process';
import { Amr } from './amr/entities/amr.entity';
import { AmrCharger } from './amr-charger/entities/amr-charger.entity';
import { AmrChargeHistory } from './amr-charge-history/entities/amr-charge-history.entity';
import { Cargo } from './cargo/entities/cargo.entity';
import { Storage } from './storage/entities/storage.entity';
import { CargoSccJoin } from './cargo-scc-join/entities/cargo-scc-join.entity';
import { Scc } from './scc/entities/scc.entity';
import { Uld } from './uld/entities/uld.entity';
import { SimulatorHistory } from './simulator-history/entities/simulator-history.entity';
import { SimulatorResult } from './simulator-result/entities/simulator-result.entity';
import { StorageHistory } from './storage-history/entities/storage-history.entity';
import { UldSccJoin } from './uld-scc-join/entities/uld-scc-join.entity';
import { UldHistory } from './uld-history/entities/uld-history.entity';
import { UldType } from './uld-type/entities/uld-type.entity';
import { StorageWorkOrder } from './storage-work-order/entities/storage-work-order.entity';
import { InspectWorkOrder } from './inspect-work-order/entities/inspect-work-order.entity';
import { TempStorage } from './temp-storage/entities/temp-storage.entity';
import { TempStorageHistory } from './temp-storage-history/entities/temp-storage-history.entity';
import { SimulatorResultCargoJoinModule } from './simulator-result-cargo-join/simulator-result-cargo-join.module';
import { SimulatorResultCargoJoin } from './simulator-result-cargo-join/entities/simulator-result-cargo-join.entity';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { TimeTableModule } from './time-table/time-table.module';
import { AircraftModule } from './aircraft/aircraft.module';
import { AircraftScheduleModule } from './aircraft-schedule/aircraft-schedule.module';
import { CommonCodeModule } from './common-code/common-code.module';
import { CargoGroupModule } from './cargo-group/cargo-group.module';
import { TimeTable } from './time-table/entities/time-table.entity';
import { Aircraft } from './aircraft/entities/aircraft.entity';
import { AircraftSchedule } from './aircraft-schedule/entities/aircraft-schedule.entity';
import { CommonCode } from './common-code/entities/common-code.entity';
import { CargoGroup } from './cargo-group/entities/cargo-group.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { MqttModule } from './mqtt.module';
import { CargoListModule } from './cargo-list/cargo-list.module';

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
            Storage,
            Cargo,
            CargoSccJoin,
            Scc,
            Uld,
            UldHistory,
            UldSccJoin,
            UldType,
            StorageWorkOrder,
            InspectWorkOrder,
            TempStorage,
            TempStorageHistory,
            StorageHistory,
            SimulatorResult,
            SimulatorHistory,
            SimulatorResultCargoJoin,
            TimeTable,
            Aircraft,
            AircraftSchedule,
            CommonCode,
            CargoGroup,
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
    StorageModule,
    CargoModule,
    CargoSccJoinModule,
    SccModule,
    UldModule,
    UldHistoryModule,
    UldSccJoinModule,
    UldTypeModule,
    StorageWorkOrderModule,
    InspectWorkOrderModule,
    TempStorageModule,
    TempStorageHistoryModule,
    StorageHistoryModule,
    SimulatorResultModule,
    SimulatorHistoryModule,
    SimulatorResultCargoJoinModule,
    TimeTableModule,
    AircraftModule,
    AircraftScheduleModule,
    CommonCodeModule,
    CargoGroupModule,
    // mqtt 모듈설정
    MqttModule,
    CargoListModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
