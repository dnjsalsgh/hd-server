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
  simulatorResult: SimulatorResult;

  @ManyToOne(() => Awb, (awb) => awb.srJoin)
  awb: Awb;
}
