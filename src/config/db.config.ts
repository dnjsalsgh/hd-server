import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Awb } from '../awb/entities/awb.entity';
import { Amr } from '../amr/entities/amr.entity';
import { AmrCharger } from '../amr-charger/entities/amr-charger.entity';
import { AmrChargeHistory } from '../amr-charge-history/entities/amr-charge-history.entity';
import { Asrs } from '../asrs/entities/asrs.entity';
import { AwbSccJoin } from '../awb-scc-join/entities/awb-scc-join.entity';
import { Scc } from '../scc/entities/scc.entity';
import { Uld } from '../uld/entities/uld.entity';
import { UldHistory } from '../uld-history/entities/uld-history.entity';
import { UldSccJoin } from '../uld-scc-join/entities/uld-scc-join.entity';
import { UldType } from '../uld-type/entities/uld-type.entity';
import { AsrsOutOrder } from '../asrs-out-order/entities/asrs-out-order.entity';
import { BuildUpOrder } from '../build-up-order/entities/build-up-order.entity';
import { SkidPlatform } from '../skid-platform/entities/skid-platform.entity';
import { SkidPlatformHistory } from '../skid-platform-history/entities/skid-platform-history.entity';
import { AsrsHistory } from '../asrs-history/entities/asrs-history.entity';
import { SimulatorResult } from '../simulator-result/entities/simulator-result.entity';
import { SimulatorHistory } from '../simulator-history/entities/simulator-history.entity';
import { SimulatorResultAwbJoin } from '../simulator-result-awb-join/entities/simulator-result-awb-join.entity';
import { TimeTable } from '../time-table/entities/time-table.entity';
import { Aircraft } from '../aircraft/entities/aircraft.entity';
import { AircraftSchedule } from '../aircraft-schedule/entities/aircraft-schedule.entity';
import { CommonCode } from '../common-code/entities/common-code.entity';
import { AwbGroup } from '../awb-group/entities/awb-group.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Vms3D } from '../vms/entities/vms.entity';
import { Hacs } from '../hacs/entities/hacs.entity';
import { Alarm } from '../alarm/entities/alarm.entity';
import { AwbReturn } from '../awb-return/entities/awb-return.entity';
import { Vms2d } from '../vms2d/entities/vms2d.entity';
import { VmsAwbResult } from '../vms-awb-result/entities/vms-awb-result.entity';
import process from 'process';
import { VmsAwbHistory } from '../vms-awb-history/entities/vms-awb-history.entity';

const postgresConfig: TypeOrmModuleOptions = {
  // PostgreSQL 연결 설정...
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
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
    Alarm,
    AwbReturn,
  ],
  // autoLoadEntities: true,  [버그있어서 사용 지양]
  logging: process.env.LOGGING === 'true', // 쿼리 보여주는 옵션
  synchronize: process.env.NODE_ENV === 'dev', // dev 환경일 때만 true
  namingStrategy: new SnakeNamingStrategy(), // db column을 snake_case로 변경
  useUTC: false,
  extra: {
    timezone: 'Asia/Seoul',
  },
};

const mssqlConfig: TypeOrmModuleOptions = {
  type: 'mssql',
  host: process.env.DIMOA_DATABASE_HOST,
  port: +process.env.DIMOA_DATABASE_PORT, // MSSQL 포트 번호
  username: process.env.DIMOA_DATABASE_USER,
  password: process.env.DIMOA_DATABASE_PASS,
  database: process.env.DIMOA_DATABASE_NAME,
  entities: [Vms3D, Vms2d],
  synchronize: false, // 개발 환경에서만 사z용하거나 자동 마이그레이션을 사용하지 않을 경우 false로 변경
  options: { encrypt: false },
  logging: true,
};

const dimoaConfig: TypeOrmModuleOptions = {
  type: 'mssql',
  host: process.env.DIMOA_DATABASE_HOST,
  port: +process.env.DIMOA_DATABASE_PORT, // MSSQL 포트 번호
  username: process.env.DIMOA_DATABASE_USER,
  password: process.env.DIMOA_DATABASE_PASS,
  database: process.env.DIMOA_DATABASE_NAME,
  entities: [VmsAwbResult, VmsAwbHistory],
  synchronize: false, // 개발 환경에서만 사용하거나 자동 마이그레이션을 사용하지 않을 경우 false로 변경
  options: { encrypt: false },
  logging: true,
};

const amrConfig: TypeOrmModuleOptions = {
  type: 'mssql',
  host: process.env.AMR_DATABASE_HOST,
  port: +process.env.AMR_DATABASE_PORT,
  username: process.env.AMR_DATABASE_USER,
  password: process.env.AMR_DATABASE_PASS,
  database: process.env.AMR_DATABASE_NAME,
  entities: [Hacs],
  synchronize: false,
  options: { trustServerCertificate: true },
  logging: false,
};

export { postgresConfig, mssqlConfig, dimoaConfig, amrConfig };
