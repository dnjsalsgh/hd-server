import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Uld } from '../../uld/entities/uld.entity';
import { SimulatorHistory } from '../../simulator-history/entities/simulator-history.entity';
import { SimulatorResultAwbJoin } from '../../simulator-result-awb-join/entities/simulator-result-awb-join.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

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
  @Column({ type: 'varchar', length: 5, nullable: true })
  version: number;

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
  Uld: Relation<Uld>;

  @OneToMany(
    () => SimulatorResultAwbJoin,
    (simulatorResultAwbJoin) => simulatorResultAwbJoin.simulatorResult,
  )
  simulatorResultAwbJoin: Relation<SimulatorResultAwbJoin[]>;

  @OneToMany(
    () => SimulatorHistory,
    (simulatorHistory) => simulatorHistory.SimulatorResult,
  )
  simulatorHistories: Relation<SimulatorHistory[]>;
}
