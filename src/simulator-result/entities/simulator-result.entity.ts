import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Uld } from '../../uld/entities/uld.entity';
import { SimulatorHistory } from '../../simulator-history/entities/simulator-history.entity';
import { SimulatorResultCargoJoin } from '../../simulator-result-cargo-join/entities/simulator-result-cargo-join.entity';
import { ApiProperty } from '@nestjs/swagger';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => Uld, (uld) => uld.simulatorResult)
  uld: Uld;

  @OneToMany(
    () => SimulatorResultCargoJoin,
    (simulatorResultCargoJoin) => simulatorResultCargoJoin.simulatorResult,
  )
  simulatorResultCargoJoin: SimulatorResultCargoJoin[];

  @OneToMany(
    () => SimulatorHistory,
    (simulatorHistory) => simulatorHistory.simulatorResult,
  )
  simulatorHistories: SimulatorHistory[];
}
