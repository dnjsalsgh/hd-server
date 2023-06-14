import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Amr } from '../../amr/entities/amr.entity';
import { AmrCharger } from '../../amr-charger/entities/amr-charger.entity';
import { Uld } from '../../uld/entities/uld.entity';

@Entity()
export class AmrData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, array: true, nullable: true })
  in_amr_01: string[];

  @Column({ type: 'varchar', length: 50, array: true, nullable: true })
  in_amr_02: string[];

  @Column({ type: 'varchar', length: 50, array: true, nullable: true })
  out_amr_01: string[];

  @Column({ type: 'date', nullable: true })
  logging_date: Date;

  @Column({ type: 'double precision', nullable: true })
  x: number;

  @Column({ type: 'double precision', nullable: true })
  y: number;

  @Column({ type: 'boolean', nullable: true })
  connected: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  error_info: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  cur_state: string;

  @Column({ type: 'json', nullable: true })
  paths: Record<string, any>;

  @Column({ type: 'varchar', length: 50, nullable: true })
  order_no: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  plt_no: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  plt_type: string;

  @Column({ type: 'int', nullable: true })
  turn_table_status: number;

  @Column({ type: 'boolean', nullable: true })
  pause_state: boolean;

  @Column({ type: 'int', nullable: true })
  prog: number;

  @Column({ type: 'int', nullable: true })
  loaded: number;

  @Column({ type: 'int', nullable: true })
  missino_no: number;

  @Column({ type: 'int', nullable: true })
  job_id: number;

  @Column({ type: 'int', nullable: true })
  action_id: number;

  @Column({ type: 'boolean', nullable: true })
  working: boolean;

  @Column({ type: 'date', nullable: false })
  created_at: Date;

  @Column({ type: 'date', nullable: false })
  updated_at: Date;

  @Column({ type: 'date', nullable: true })
  deleted_at: Date;

  @ManyToOne(() => Amr, (amr) => amr.amrChargeHistories, {
    onDelete: 'SET NULL',
  })
  amr: Amr;

  @ManyToOne(() => Uld, (uld) => uld.amrDatas, {
    onDelete: 'SET NULL',
  })
  ulds: Uld;
}
