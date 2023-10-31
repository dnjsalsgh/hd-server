import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

import { SimulatorResult } from '../../simulator-result/entities/simulator-result.entity';
import { SimulatorHistory } from '../../simulator-history/entities/simulator-history.entity';
import { UldType } from '../../uld-type/entities/uld-type.entity';
import { UldHistory } from '../../uld-history/entities/uld-history.entity';
import { TimeTable } from '../../time-table/entities/time-table.entity';
import { ApiProperty } from '@nestjs/swagger';
import { BuildUpOrder } from '../../build-up-order/entities/build-up-order.entity';
import { Scc } from '../../scc/entities/scc.entity';
import { AircraftSchedule } from '../../aircraft-schedule/entities/aircraft-schedule.entity';

@Entity()
export class Uld {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Uld-001',
    description: 'Uld 코드',
  })
  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  code: string;

  @ApiProperty({
    example: '프리맵명',
    description: '프리맵명',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  prefab: string;

  @ApiProperty({
    example: '보잉070',
    description: '항공기종류',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  airplaneType: string;

  @ApiProperty({
    example: true,
    description: '시뮬레이션모드',
  })
  @Column({ type: 'boolean', nullable: true })
  simulation: boolean;

  // 피드백 반영 후 새로생긴 칼럼
  @ApiProperty({
    example: '경계 프리맵',
    description: '경계 프리맵',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  boundaryPrefab: string;

  // 적재율이 필요해서 넣은 칼럼
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

  @ApiProperty({
    example: 1,
    description: 'uld유형 FK',
  })
  @ManyToOne(() => UldType, (uldType) => uldType.ulds)
  UldType: Relation<UldType> | number;

  @ApiProperty({
    example: 1,
    description: '항공편 FK',
  })
  @ManyToOne(
    () => AircraftSchedule,
    (aircraftSchedule) => aircraftSchedule.Ulds,
  )
  AircraftSchedule?: Relation<AircraftSchedule> | number;

  @OneToMany(() => BuildUpOrder, (buildUpOrder) => buildUpOrder.Uld)
  buildUpOrders: Relation<BuildUpOrder[]>;

  @OneToMany(() => SimulatorResult, (simulatorResult) => simulatorResult.Uld)
  simulatorResult: Relation<SimulatorResult[]>;

  @OneToMany(() => SimulatorHistory, (simulatorHistory) => simulatorHistory.Uld)
  simulatorHistories: Relation<SimulatorHistory[]>;

  @OneToMany(() => UldHistory, (uldHistory) => uldHistory.Uld)
  uldHistories: Relation<UldHistory[]>;

  @ManyToMany(() => Scc, (scc) => scc.Uld, {
    cascade: true,
  })
  @JoinTable({
    name: 'uld_scc_join',
    joinColumn: {
      name: 'uld_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'scc_id',
      referencedColumnName: 'id',
    },
  })
  Scc: Scc[];

  @OneToMany(() => TimeTable, (timeTable) => timeTable.Uld)
  timeTables: Relation<TimeTable[]>;
}

export const UldAttribute = {
  id: true,
  code: true,
  prefab: true,
  airplaneType: true,
  simulation: true,
  boundaryPrefab: true,
  loadRate: true,
  createdAt: true,
};
