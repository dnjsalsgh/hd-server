import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Amr } from '../../amr/entities/amr.entity';
import { AmrCharger } from '../../amr-charger/entities/amr-charger.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
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
  @Column({ nullable: false })
  soc: string;

  @ApiProperty({
    example: 'soh',
    description: '배터리SOH',
  })
  @Column({ nullable: false })
  soh: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
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
