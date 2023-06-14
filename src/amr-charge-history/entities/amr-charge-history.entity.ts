import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Amr } from '../../amr/entities/amr.entity';
import { AmrCharger } from '../../amr-charger/entities/amr-charger.entity';

@Entity()
export class AmrChargeHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  chargeStart: Date;

  @Column({ nullable: false })
  chargeEnd: Date;

  @Column({ nullable: false })
  soc: string;

  @Column({ nullable: false })
  soh: string;

  @Column({ nullable: false })
  createdAt: Date;

  @Column({ nullable: false })
  updatedAt: Date;

  @Column({ nullable: false })
  deletedAt: Date | null;

  @ManyToOne(() => Amr, (amr) => amr.amrChargeHistories, {
    onDelete: 'SET NULL',
  })
  amr: Amr;

  @ManyToOne(() => AmrCharger, (amrCharger) => amrCharger.amrChargeHistories, {
    onDelete: 'SET NULL',
  })
  amrCharger: AmrCharger;
}
