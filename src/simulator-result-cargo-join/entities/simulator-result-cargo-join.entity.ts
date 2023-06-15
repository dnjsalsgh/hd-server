import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cargo } from '../../cargo/entities/cargo.entity';
import { SimulatorResult } from '../../simulator-result/entities/simulator-result.entity';

@Entity()
export class SimulatorResultCargoJoin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', nullable: false })
  createdAt: Date;

  @Column({ type: 'date', nullable: false })
  updatedAt: Date;

  @Column({ type: 'date', nullable: true })
  deletedAt: Date;

  // @ManyToOne(
  //   () => SimulatorResult,
  //   (simulatorResult) => simulatorResult.simulatorResultCargoJoin,
  // )
  // simulatorResult: SimulatorResult;

  // @ManyToOne(() => Cargo, (cargo) => cargo.simulatorResultCargoJoin)
  // cargo: Cargo;

  @ManyToOne(
    () => SimulatorResult,
    (simulatorResult) => simulatorResult.simulatorResultCargoJoin,
  )
  simulatorResult: SimulatorResult;

  @ManyToOne(() => Cargo, (cargo) => cargo.srJoin)
  cargo: Cargo;
}
