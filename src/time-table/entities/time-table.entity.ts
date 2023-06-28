import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Uld } from '../../uld/entities/uld.entity';
import { Amr } from '../../amr/entities/amr.entity';
import { Cargo } from '../../cargo/entities/cargo.entity';

@Entity()
export class TimeTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb' })
  data: JSON;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => Uld, (uld) => uld.timeTables)
  uld: Uld;

  @ManyToOne(() => Amr, (amr) => amr.timeTables)
  amr: Amr;

  @ManyToOne(() => Cargo, (cargo) => cargo.timeTables)
  timeTable: TimeTable;
}
