import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cargo } from '../../cargo/entities/cargo.entity';
import { SimulatorResult } from '../../simulator-result/entities/simulator-result.entity';

@Entity()
export class SimulatorResultCargoJoin {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(
    () => SimulatorResult,
    (simulatorResult) => simulatorResult.simulatorResultCargoJoin,
  )
  simulatorResult: SimulatorResult;

  @ManyToOne(() => Cargo, (cargo) => cargo.srJoin)
  cargo: Cargo;
}
