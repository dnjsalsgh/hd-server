import { TypeOrmModule } from '@nestjs/typeorm';
import { Amr } from '../../amr/entities/amr.entity';
import { AmrCharger } from '../../amr-charger/entities/amr-charger.entity';
import { AmrChargeHistory } from '../../amr-charge-history/entities/amr-charge-history.entity';
import { Asrs } from '../../asrs/entities/asrs.entity';
import { Awb } from '../../awb/entities/awb.entity';
import { AwbSccJoin } from '../../awb-scc-join/entities/awb-scc-join.entity';
import { Scc } from '../../scc/entities/scc.entity';
import { Uld } from '../../uld/entities/uld.entity';
import { UldHistory } from '../../uld-history/entities/uld-history.entity';
import { UldSccJoin } from '../../uld-scc-join/entities/uld-scc-join.entity';
import { UldType } from '../../uld-type/entities/uld-type.entity';
import { AsrsOutOrder } from '../../asrs-out-order/entities/asrs-out-order.entity';
import { BuildUpOrder } from '../../build-up-order/entities/build-up-order.entity';
import { SkidPlatform } from '../../skid-platform/entities/skid-platform.entity';
import { SkidPlatformHistory } from '../../skid-platform-history/entities/skid-platform-history.entity';
import { AsrsHistory } from '../../asrs-history/entities/asrs-history.entity';
import { SimulatorResult } from '../../simulator-result/entities/simulator-result.entity';
import { SimulatorHistory } from '../../simulator-history/entities/simulator-history.entity';
import { SimulatorResultAwbJoin } from '../../simulator-result-awb-join/entities/simulator-result-awb-join.entity';
import { TimeTable } from '../../time-table/entities/time-table.entity';
import { Aircraft } from '../../aircraft/entities/aircraft.entity';
import { AircraftSchedule } from '../../aircraft-schedule/entities/aircraft-schedule.entity';
import { CommonCode } from '../../common-code/entities/common-code.entity';
import { AwbGroup } from '../../awb-group/entities/awb-group.entity';
import { DataSourceOptions } from 'typeorm';

export const setTypeOrmForTest = TypeOrmModule.forRoot({
  type: 'postgres',
  database: 'test',
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
  host: 'localhost',
  username: 'postgres',
  password: '1234',
  port: 5432,
  logging: false,
  synchronize: true,
});

export const setDataSourceForTest: DataSourceOptions = {
  type: 'postgres',
  database: 'test',
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
  host: 'localhost',
  username: 'postgres',
  password: '1234',
  port: 5432,
  logging: false,
  synchronize: true,
};
