import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InspectWorkOrder } from '../../inspect-work-order/entities/inspect-work-order.entity';
import { SimulatorResult } from '../../simulator-result/entities/simulator-result.entity';
import { SimulatorHistory } from '../../simulator-history/entities/simulator-history.entity';
import { UldType } from '../../uld-type/entities/uld-type.entity';
import { UldHistory } from '../../uld-history/entities/uld-history.entity';
import { UldSccJoin } from '../../uld-scc-join/entities/uld-scc-join.entity';
import { TimeTable } from '../../time-table/entities/time-table.entity';

@Entity()
export class Uld {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  code: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  prefab: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  airplaneType: string;

  @Column({ type: 'boolean', nullable: true })
  simulation: boolean;

  @Column({ type: 'date', nullable: false })
  createdAt: Date;

  @Column({ type: 'date', nullable: false })
  updatedAt: Date;

  @Column({ type: 'date', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => UldType, (uldType) => uldType.ulds)
  uldType: UldType;

  @OneToMany(() => InspectWorkOrder, (inspectWorkOrder) => inspectWorkOrder.uld)
  inspectWorkOrders: InspectWorkOrder[];

  @OneToMany(() => SimulatorResult, (simulatorResult) => simulatorResult.uld)
  simulatorResult: SimulatorResult[];

  @OneToMany(() => SimulatorHistory, (simulatorHistory) => simulatorHistory.uld)
  simulatorHistories: SimulatorHistory[];

  @OneToMany(() => UldHistory, (uldHistory) => uldHistory.inspectWorkOrder)
  uldHistories: UldHistory[];

  @OneToMany(() => UldSccJoin, (uldSccJoin) => uldSccJoin.uld)
  uldSccJoin: UldSccJoin[];

  @OneToMany(() => TimeTable, (timeTable) => timeTable.timeTable)
  timeTables: TimeTable[];
}
