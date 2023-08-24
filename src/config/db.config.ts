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
import { Vms } from '../vms/entities/vms.entity';

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
  ],
  // autoLoadEntities: true,  [버그있어서 사용 지양]
  logging: true, // 쿼리 보여주는 옵션
  synchronize: process.env.NODE_ENV === 'dev', // dev 환경일 때만 true
  namingStrategy: new SnakeNamingStrategy(), // db column을 snake_case로 변경
};

const mssqlConfig: TypeOrmModuleOptions = {
  type: 'mssql',
  host: process.env.MSSQL_DATABASE_HOST,
  port: +process.env.MSSQL_DATABASE_PORT, // MSSQL 포트 번호
  username: process.env.MSSQL_DATABASE_USER,
  password: process.env.MSSQL_DATABASE_PASS,
  database: process.env.MSSQL_DATABASE_NAME,
  entities: [Vms, CommonCode],
  synchronize: true, // 개발 환경에서만 사용하거나 자동 마이그레이션을 사용하지 않을 경우 false로 변경
  options: { trustServerCertificate: true },
  logging: true,
};

export { postgresConfig, mssqlConfig };
