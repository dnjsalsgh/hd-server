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

import { SimulatorResult } from '../../simulator-result/entities/simulator-result.entity';
import { SimulatorHistory } from '../../simulator-history/entities/simulator-history.entity';
import { UldType } from '../../uld-type/entities/uld-type.entity';
import { UldHistory } from '../../uld-history/entities/uld-history.entity';
import { UldSccJoin } from '../../uld-scc-join/entities/uld-scc-join.entity';
import { TimeTable } from '../../time-table/entities/time-table.entity';
import { ApiProperty } from '@nestjs/swagger';
import { BuildUpOrder } from '../../build-up-order/entities/build-up-order.entity';

@Entity()
export class Uld {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'uld-001',
    description: 'uld 코드',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
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
  uldType: Relation<UldType>;

  @OneToMany(() => BuildUpOrder, (inspectWorkOrder) => inspectWorkOrder.uld)
  inspectWorkOrders: Relation<BuildUpOrder[]>;

  @OneToMany(() => SimulatorResult, (simulatorResult) => simulatorResult.uld)
  simulatorResult: Relation<SimulatorResult[]>;

  @OneToMany(() => SimulatorHistory, (simulatorHistory) => simulatorHistory.uld)
  simulatorHistories: Relation<SimulatorHistory[]>;

  @OneToMany(() => UldHistory, (uldHistory) => uldHistory.buildUpOrder)
  uldHistories: Relation<UldHistory[]>;

  @OneToMany(() => UldSccJoin, (uldSccJoin) => uldSccJoin.uld)
  uldSccJoin: Relation<UldSccJoin[]>;

  @OneToMany(() => TimeTable, (timeTable) => timeTable.uld)
  timeTables: Relation<TimeTable[]>;
}
