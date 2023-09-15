import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Uld } from '../../uld/entities/uld.entity';
import { SimulatorHistory } from '../../simulator-history/entities/simulator-history.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Awb } from '../../awb/entities/awb.entity';

@Entity()
export class SimulatorResult {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: new Date(),
    description: '시뮬레이터 시작시간',
  })
  @Column({ type: 'date', nullable: false })
  startDate: Date;

  @ApiProperty({
    example: new Date(),
    description: '시뮬레이터 종료시간',
  })
  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @ApiProperty({
    example: 10.0,
    description: '적재율',
  })
  @Column({ type: 'double precision', nullable: true })
  loadRate: number;

  @ApiProperty({
    example: '0.1',
    description: '알고리즘 버전',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  version: number;

  @ApiProperty({
    example: true,
    description: '시뮬레이션 모드',
  })
  @Column({ nullable: true })
  simulation: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ApiProperty({
    example: 1,
    description: 'ULD FK',
  })
  @IsNotEmpty()
  @ManyToOne(() => Uld, (uld) => uld.simulatorResult, { nullable: false })
  Uld: Relation<Uld> | number;

  @ManyToMany(() => Awb, (awb) => awb.SimulatorResult)
  @JoinColumn({ name: 'awb_id' })
  Awb: Awb[];

  @OneToMany(
    () => SimulatorHistory,
    (simulatorHistory) => simulatorHistory.SimulatorResult,
  )
  simulatorHistories: Relation<SimulatorHistory[]>;
}

export const SimulatorResultAttribute = {
  id: true,
  startDate: true,
  endDate: true,
  loadRate: true,
  version: true,
  createdAt: true,
};
