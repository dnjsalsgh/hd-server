import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Uld } from '../../uld/entities/uld.entity';
import { SimulatorHistory } from '../../simulator-history/entities/simulator-history.entity';
import { SimulatorResultCargoJoin } from '../../simulator-result-cargo-join/entities/simulator-result-cargo-join.entity';

@Entity()
export class SimulatorResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', nullable: false })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'double precision', nullable: true })
  loadRate: number;

  @Column({ type: 'date', nullable: false })
  createdAt: Date;

  @Column({ type: 'date', nullable: false })
  updatedAt: Date;

  @Column({ type: 'date', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => Uld, (uld) => uld.simulatorResult)
  uld: Uld;

  @OneToMany(
    () => SimulatorResultCargoJoin,
    (simulatorResultCargoJoin) => simulatorResultCargoJoin.simulatorResult,
  )
  simulatorResultCargoJoin: SimulatorResultCargoJoin[];

  @OneToMany(
    () => SimulatorHistory,
    (simulatorHistory) => simulatorHistory.simulatorResult,
  )
  simulatorHistories: SimulatorHistory[];
}
