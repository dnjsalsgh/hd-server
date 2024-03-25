import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Relation,
  Unique,
} from 'typeorm';
import { Amr } from '../../amr/entities/amr.entity';
import { AmrCharger } from '../../amr-charger/entities/amr-charger.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Unique(['amr', 'amrCharger'])
export class AmrChargeHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: new Date(),
    description: '충전시작시간',
  })
  @Column({ nullable: false })
  chargeStart: Date;

  @ApiProperty({
    example: new Date(),
    description: '충전종료시간',
  })
  @Column({ nullable: false })
  chargeEnd: Date;

  @ApiProperty({
    example: 'soc',
    description: '배터리SOC',
  })
  @Column({ nullable: true })
  soc: string;

  @ApiProperty({
    example: 'soh',
    description: '배터리SOH',
  })
  @Column({ nullable: true })
  soh: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date | null;

  @ApiProperty({
    example: 1,
    description: 'AMR FK',
    type: () => Amr,
  })
  @ManyToOne(() => Amr, (amr) => amr.amrChargeHistories, {
    onDelete: 'SET NULL',
  })
  amr: Relation<Amr> | number;

  @ApiProperty({
    example: 1,
    description: 'AMR Charger FK',
    type: () => AmrCharger,
  })
  @ManyToOne(() => AmrCharger, (amrCharger) => amrCharger.amrChargeHistories, {
    onDelete: 'SET NULL',
  })
  amrCharger: Relation<AmrCharger> | number;
}
