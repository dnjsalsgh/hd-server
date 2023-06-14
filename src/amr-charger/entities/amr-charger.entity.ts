import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AmrChargeHistory } from '../../amr-charge-history/entities/amr-charge-history.entity';

@Entity()
export class AmrCharger {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string;

  @Column({ type: 'boolean', nullable: true })
  working: boolean;

  @Column({ type: 'double precision', nullable: true })
  x: number;

  @Column({ type: 'double precision', nullable: true })
  y: number;

  @Column({ type: 'double precision', nullable: true })
  z: number;

  @Column({ type: 'date', nullable: false })
  created_at: Date;

  @Column({ type: 'date', nullable: true })
  updated_at: Date;

  @Column({ type: 'date', nullable: true })
  deleted_at: Date;

  @OneToMany(
    () => AmrChargeHistory,
    (amrChargeHistory) => amrChargeHistory.amrCharger,
  )
  amrChargeHistories: AmrChargeHistory[];
}
