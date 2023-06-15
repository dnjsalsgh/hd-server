import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AmrChargeHistory } from '../../amr-charge-history/entities/amr-charge-history.entity';
import { AmrData } from '../../amr-data/entities/amr-data.entity';
import { InspectWorkOrder } from '../../inspect-work-order/entities/inspect-work-order.entity';
import { SimulatorResult } from '../../simulator-result/entities/simulator-result.entity';
import { SimulatorHistory } from '../../simulator-history/entities/simulator-history.entity';
import { StackerData } from '../../stacker-data/entities/stacker-data.entity';
import { UldType } from '../../uld-type/entities/uld-type.entity';
import { UldHistory } from '../../uld-history/entities/uld-history.entity';
import { SimulatorResultCargoJoin } from '../../simulator-result-cargo-join/entities/simulator-result-cargo-join.entity';
import { UldSccJoin } from '../../uld-scc-join/entities/uld-scc-join.entity';

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

  @OneToMany(() => AmrData, (amrData) => amrData.ulds)
  amrDatas: AmrData[];

  @OneToMany(() => InspectWorkOrder, (inspectWorkOrder) => inspectWorkOrder.uld)
  inspectWorkOrders: InspectWorkOrder[];

  @OneToMany(() => SimulatorResult, (simulatorResult) => simulatorResult.uld)
  simulatorResult: SimulatorResult[];

  @OneToMany(() => SimulatorHistory, (simulatorHistory) => simulatorHistory.uld)
  simulatorHistories: SimulatorHistory[];

  @OneToMany(() => StackerData, (stackerData) => stackerData.uld)
  stackerDatas: StackerData[];

  @OneToMany(() => UldHistory, (uldHistory) => uldHistory.inspectWorkOrder)
  uldHistories: UldHistory[];

  @OneToMany(() => UldSccJoin, (uldSccJoin) => uldSccJoin.uld)
  uldSccJoin: UldSccJoin[];
}
