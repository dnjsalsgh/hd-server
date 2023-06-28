import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InspectWorkOrder } from '../../inspect-work-order/entities/inspect-work-order.entity';
import { SimulatorHistory } from '../../simulator-history/entities/simulator-history.entity';
import { StorageHistory } from '../../storage-history/entities/storage-history.entity';
import { StorageWorkOrder } from '../../storage-work-order/entities/storage-work-order.entity';
import { TempStorageHistory } from '../../temp-storage-history/entities/temp-storage-history.entity';
import { UldHistory } from '../../uld-history/entities/uld-history.entity';
import { SimulatorResultCargoJoin } from '../../simulator-result-cargo-join/entities/simulator-result-cargo-join.entity';
import { CargoSccJoin } from '../../cargo-scc-join/entities/cargo-scc-join.entity';
import { CargoGroup } from '../../cargo-group/entities/cargo-group.entity';
import { CargoGroupModule } from '../../cargo-group/cargo-group.module';
import { TimeTable } from '../../time-table/entities/time-table.entity';

@Entity()
export class Cargo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  prefab: string;

  @Column({ type: 'double precision', nullable: true })
  waterVolume: number;

  @Column({ type: 'double precision', nullable: true })
  squareVolume: number;

  @Column({ type: 'double precision', nullable: true })
  width: number;

  @Column({ type: 'double precision', nullable: true })
  length: number;

  @Column({ type: 'double precision', nullable: true })
  height: number;

  @Column({ type: 'double precision', nullable: true })
  weight: number;

  @Column({ type: 'boolean', nullable: true })
  orthopedic: boolean;

  @Column({ type: 'varchar', length: 500, nullable: true })
  barcode: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  destination: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  source: string;

  @Column({ type: 'boolean', nullable: true })
  breakDown: boolean;

  @Column({ type: 'int', nullable: true })
  piece: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  state: string;

  @Column({ type: 'int', nullable: true })
  parent: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  modelPath: string;

  @Column({ type: 'boolean', nullable: true })
  simulation: boolean;

  @Column({ type: 'date', nullable: false })
  createdAt: Date;

  @Column({ type: 'date', nullable: false })
  updatedAt: Date;

  @Column({ type: 'date', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => CargoGroup, (cargoGroup) => cargoGroup.cargos)
  cargoGroup: CargoGroup;

  @OneToMany(
    () => InspectWorkOrder,
    (inspectWorkOrder) => inspectWorkOrder.cargo,
  )
  inspectWorkOrders: InspectWorkOrder[];

  @OneToMany(
    () => SimulatorHistory,
    (simulatorHistory) => simulatorHistory.cargo,
  )
  simulatorHistories: SimulatorHistory[];

  @OneToMany(() => StorageHistory, (storageHistory) => storageHistory.cargo)
  storageHistories: StorageHistory[];

  @OneToMany(
    () => StorageWorkOrder,
    (storageWorkOrder) => storageWorkOrder.cargo,
  )
  storageWorkOrders: StorageWorkOrder[];

  @OneToMany(
    () => TempStorageHistory,
    (tempStorageHistory) => tempStorageHistory.cargo,
  )
  tempStorageHistories: TempStorageHistory[];

  @OneToMany(() => UldHistory, (uldHistory) => uldHistory.inspectWorkOrder)
  uldHistories: UldHistory[];

  @OneToMany(() => CargoSccJoin, (cargoSccJoin) => cargoSccJoin.cargo)
  cargoSccJoin: CargoSccJoin[];

  @OneToMany(
    () => SimulatorResultCargoJoin,
    (simulatorResultCargoJoin) => simulatorResultCargoJoin.cargo,
  )
  srJoin: SimulatorResultCargoJoin[];

  @OneToMany(() => TimeTable, (timeTable) => timeTable.timeTable)
  timeTables: TimeTable[];
}
