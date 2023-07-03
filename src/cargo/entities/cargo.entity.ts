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
import { InspectWorkOrder } from '../../inspect-work-order/entities/inspect-work-order.entity';
import { SimulatorHistory } from '../../simulator-history/entities/simulator-history.entity';
import { StorageHistory } from '../../storage-history/entities/storage-history.entity';
import { StorageWorkOrder } from '../../storage-work-order/entities/storage-work-order.entity';
import { TempStorageHistory } from '../../temp-storage-history/entities/temp-storage-history.entity';
import { UldHistory } from '../../uld-history/entities/uld-history.entity';
import { SimulatorResultCargoJoin } from '../../simulator-result-cargo-join/entities/simulator-result-cargo-join.entity';
import { CargoSccJoin } from '../../cargo-scc-join/entities/cargo-scc-join.entity';
import { CargoGroup } from '../../cargo-group/entities/cargo-group.entity';
import { TimeTable } from '../../time-table/entities/time-table.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Cargo {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '3d Model Name',
    description: '생성된 3D 모델링명',
  })
  @Column({ type: 'varchar', length: 50, nullable: false })
  prefab: string;

  @ApiProperty({
    example: 1.0,
    description: '워터볼륨',
  })
  @Column({ type: 'double precision', nullable: true })
  waterVolume: number;

  @ApiProperty({
    example: 1.0,
    description: '스퀘어볼륨',
  })
  @Column({ type: 'double precision', nullable: true })
  squareVolume: number;

  @ApiProperty({
    example: 1.0,
    description: '폭',
  })
  @Column({ type: 'double precision', nullable: true })
  width: number;

  @ApiProperty({
    example: 1.0,
    description: '너비',
  })
  @Column({ type: 'double precision', nullable: true })
  length: number;

  @ApiProperty({
    example: 1.0,
    description: '높이',
  })
  @Column({ type: 'double precision', nullable: true })
  height: number;

  @ApiProperty({
    example: 1.0,
    description: '중량',
  })
  @Column({ type: 'double precision', nullable: true })
  weight: number;

  @ApiProperty({
    example: true,
    description: '정형성',
  })
  @Column({ type: 'boolean', nullable: true })
  orthopedic: boolean;

  @ApiProperty({
    example: '010101',
    description: '바코드',
  })
  @Column({ type: 'varchar', length: 500, nullable: true })
  barcode: string;

  @ApiProperty({
    example: '미국',
    description: '목적지',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  destination: string;

  @ApiProperty({
    example: '한국',
    description: '생성출처',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  source: string;

  @ApiProperty({
    example: false,
    description: '해포여부 (true: 해포됨, false 해포안됨)',
  })
  @Column({ type: 'boolean', nullable: true })
  breakDown: boolean;

  @ApiProperty({
    example: 1,
    description: 'piece수 breakdown된 경우에만 데이터 있음',
  })
  @Column({ type: 'int', nullable: true })
  piece: number;

  @ApiProperty({
    example: 'not breakDown',
    description: '상태',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  state: string;

  @ApiProperty({
    example: 0,
    description: '해포된 화물의 부모, 추척하기 위함',
  })
  @Column({ type: 'int', nullable: true })
  parent: number;

  @ApiProperty({
    example: '/c/file/xxx',
    description: '모델파일 경로',
  })
  @Column({ type: 'varchar', length: 500, nullable: true })
  modelPath: string;

  @ApiProperty({
    example: true,
    description: '시뮬레이션 모드',
  })
  @Column({ type: 'boolean', nullable: true })
  simulation: boolean;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => CargoGroup, (cargoGroup) => cargoGroup.cargos)
  cargoGroup: CargoGroup;

  @OneToMany(
    () => InspectWorkOrder,
    (inspectWorkOrder) => inspectWorkOrder.cargo,
  )
  inspectWorkOrders: InspectWorkOrder[];

  @OneToMany(
    () => SimulatorHistory,
    (simulatorHistory) => simulatorHistory.cargo,
  )
  simulatorHistories: SimulatorHistory[];

  @OneToMany(() => StorageHistory, (storageHistory) => storageHistory.cargo)
  storageHistories: StorageHistory[];

  @OneToMany(
    () => StorageWorkOrder,
    (storageWorkOrder) => storageWorkOrder.cargo,
  )
  storageWorkOrders: StorageWorkOrder[];

  @OneToMany(
    () => TempStorageHistory,
    (tempStorageHistory) => tempStorageHistory.cargo,
  )
  tempStorageHistories: TempStorageHistory[];

  @OneToMany(() => UldHistory, (uldHistory) => uldHistory.inspectWorkOrder)
  uldHistories: UldHistory[];

  @OneToMany(() => CargoSccJoin, (cargoSccJoin) => cargoSccJoin.cargo)
  cargoSccJoin: CargoSccJoin[];

  @OneToMany(
    () => SimulatorResultCargoJoin,
    (simulatorResultCargoJoin) => simulatorResultCargoJoin.cargo,
  )
  srJoin: SimulatorResultCargoJoin[];

  @OneToMany(() => TimeTable, (timeTable) => timeTable.timeTable)
  timeTables: TimeTable[];
}
