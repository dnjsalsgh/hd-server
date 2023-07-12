import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { SimulatorResult } from '../../simulator-result/entities/simulator-result.entity';
import { Uld } from '../../uld/entities/uld.entity';
import { Awb } from '../../awb/entities/awb.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class SimulatorHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 1.0,
    description: 'x좌표',
  })
  @Column({ type: 'double precision', nullable: true })
  x: number;

  @ApiProperty({
    example: 1.0,
    description: 'y좌표',
  })
  @Column({ type: 'double precision', nullable: true })
  y: number;

  @ApiProperty({
    example: 1.0,
    description: 'z좌표',
  })
  @Column({ type: 'double precision', nullable: true })
  z: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ApiProperty({
    example: 1,
    description: '시뮬레이션 FK',
  })
  @ManyToOne(
    () => SimulatorResult,
    (simulatorResult) => simulatorResult.simulatorHistories,
  )
  simulatorResult: Relation<SimulatorResult>;

  @ApiProperty({
    example: 1,
    description: 'ULD FK',
  })
  @ManyToOne(() => Uld, (uld) => uld.simulatorHistories)
  uld: Relation<Uld>;

  @ApiProperty({
    example: 1,
    description: 'Awb FK',
  })
  @ManyToOne(() => Awb, (awb) => awb.simulatorHistories)
  awb: Relation<Awb>;
}
