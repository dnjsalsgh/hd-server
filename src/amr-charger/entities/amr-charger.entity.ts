import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AmrChargeHistory } from '../../amr-charge-history/entities/amr-charge-history.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class AmrCharger {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Amr-001',
    description: '충전이름',
  })
  @Column({ type: 'varchar', length: 50, nullable: true, unique: true })
  name: string;

  @ApiProperty({
    example: true,
    description: '사용여부',
  })
  @Column({ type: 'boolean', nullable: true })
  working: boolean;

  @ApiProperty({
    example: 1,
    description: '유니티 안 x좌표',
  })
  @Column({ type: 'double precision', nullable: true })
  x: number;

  @ApiProperty({
    example: 1,
    description: '유니티 안 y좌표',
  })
  @Column({ type: 'double precision', nullable: true })
  y: number;

  @ApiProperty({
    example: 1,
    description: '유니티 안 z좌표',
  })
  @Column({ type: 'double precision', nullable: true })
  z: number;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(
    () => AmrChargeHistory,
    (amrChargeHistory) => amrChargeHistory.amrCharger,
  )
  amrChargeHistories: AmrChargeHistory[];
}
