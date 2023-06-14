import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Amr } from '../../amr/entities/amr.entity';
import { Uld } from '../../uld/entities/uld.entity';

@Entity()
export class StackerData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean', nullable: true })
  working: boolean;

  @Column({ type: 'date', nullable: false })
  createdAt: Date;

  @Column({ type: 'date', nullable: false })
  updatedAt: Date;

  @Column({ type: 'date', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => Amr, (amr) => amr.stackerDatas)
  amr: Amr;

  @ManyToOne(() => Uld, (uld) => uld.stackerDatas)
  uld: Uld;
}
