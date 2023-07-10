import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Awb } from '../../awb/entities/awb.entity';
import { SimulatorResult } from '../../simulator-result/entities/simulator-result.entity';

@Entity()
export class SimulatorResultAwbJoin {
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
  simulatorResult: Relation<SimulatorResult>;

  @ManyToOne(() => Awb, (awb) => awb.srJoin)
  awb: Relation<Awb>;
}
