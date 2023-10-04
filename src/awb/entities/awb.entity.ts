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
import { SimulatorHistory } from '../../simulator-history/entities/simulator-history.entity';
import { AsrsHistory } from '../../asrs-history/entities/asrs-history.entity';
import { SkidPlatformHistory } from '../../skid-platform-history/entities/skid-platform-history.entity';
import { UldHistory } from '../../uld-history/entities/uld-history.entity';
import { AwbGroup } from '../../awb-group/entities/awb-group.entity';
import { TimeTable } from '../../time-table/entities/time-table.entity';
import { ApiProperty } from '@nestjs/swagger';
import { SimulatorResultAwbJoin } from '../../simulator-result-awb-join/entities/simulator-result-awb-join.entity';
import { BuildUpOrder } from '../../build-up-order/entities/build-up-order.entity';
import { AsrsOutOrder } from '../../asrs-out-order/entities/asrs-out-order.entity';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Scc } from '../../scc/entities/scc.entity';
import { SimulatorResult } from '../../simulator-result/entities/simulator-result.entity';
import { AircraftSchedule } from '../../aircraft-schedule/entities/aircraft-schedule.entity';
import { AwbReturn } from '../../awb-return/entities/awb-return.entity';

@Entity()
export class Awb {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '화물-001',
    description: '화물의 이름',
  })
  @Column({ type: 'varchar', length: 500, nullable: false, unique: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '3d Model Name',
    description: '생성된 3D 모델링명',
  })
  @Column({ type: 'varchar', length: 500, nullable: true })
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
    description: '폭(x)',
  })
  @Column({ type: 'double precision', nullable: true })
  width: number;

  @ApiProperty({
    example: 1.0,
    description: '높이(y)',
  })
  @Column({ type: 'double precision', nullable: true })
  length: number;

  @ApiProperty({
    example: 1.0,
    description: '깊이(z)',
  })
  @Column({ type: 'double precision', nullable: true })
  depth: number;

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
  isStructure: boolean;

  @ApiProperty({
    example: '010101',
    description: '바코드',
  })
  @Column({ type: 'varchar', length: 5000, nullable: true })
  barcode: string;

  @ApiProperty({
    example: '미국',
    description: '목적지',
  })
  @Column({ type: 'varchar', length: 500, nullable: true })
  destination: string;

  @ApiProperty({
    example: '한국',
    description: '생성출처',
  })
  @Column({ type: 'varchar', length: 500, nullable: true })
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
    example: 'saved',
    description:
      '상태(예약미입고, 입고중, 창고대기, 불출예정, 이동중, uld 작업장 대기, ULD작업',
  })
  @IsString()
  @IsEnum([
    'saved',
    'invms',
    'inasrs',
    'register',
    'outasrs',
    'inskidplatform',
    'inuld',
  ])
  @Column({ type: 'varchar', length: 500, nullable: true, default: 'saved' })
  state: string;

  @ApiProperty({
    example: 0,
    description: '해포된 화물의 부모, 추척하기 위함',
  })
  @Column({ type: 'int', nullable: true })
  parent: number;

  @ApiProperty({
    example: '',
    description: '모델파일 경로',
  })
  @Column({ type: 'varchar', length: 5000, nullable: true })
  modelPath: string;

  @ApiProperty({
    example: true,
    description: '시뮬레이션 모드',
  })
  @Column({ type: 'boolean', nullable: true })
  simulation: boolean;

  // v1 피드백 반영 후 새로생긴 칼럼
  @ApiProperty({
    example: 1.0,
    description: '데이터 용량',
  })
  @Column({ type: 'double precision', nullable: true })
  dataCapacity: number;

  @ApiProperty({
    example: 'fly',
    description: '항공편',
  })
  @Column({ type: 'varchar', length: 500, nullable: true })
  flight: string;

  @ApiProperty({
    example: '출발지',
    description: '출발지',
  })
  @Column({ type: 'varchar', length: 500, nullable: true })
  from: string;

  @ApiProperty({
    example: '공항도착',
    description: '공항도착',
  })
  @Column({ type: 'varchar', length: 500, nullable: true })
  airportArrival: string;
  // ========= v1 피드백 반영 후 새로생긴 칼럼 끝 =========

  // ============v0.2 추가=================
  @ApiProperty({
    example: '/c/file/xxx',
    description: '이미지 경로',
  })
  @Column({ type: 'varchar', length: 5000, nullable: true })
  path: string;

  @ApiProperty({
    example: 1,
    description: '화물의 등장 빈도',
  })
  @Column({ type: 'int', nullable: true })
  spawnRatio: number;

  @ApiProperty({
    example: '배송설명',
    description: '배송설명',
  })
  @Column({ type: 'varchar', length: 5000, nullable: true })
  description: string;

  @ApiProperty({
    example: 'RM 코멘트',
    description: 'RM 코멘트',
  })
  @Column({ type: 'varchar', length: 5000, nullable: true })
  rmComment: string;

  @ApiProperty({
    example: '2023-07-12',
    description: '로컬타임',
  })
  @Column({ type: 'timestamp', nullable: true })
  localTime: Date;

  @ApiProperty({
    example: 'AIR-001',
    description: '터미널 내에 화물이 현재 위치하고 있는 사항',
  })
  @Column({ type: 'varchar', length: 5000, nullable: true })
  localInTerminal: string;
  // ============v0.2 추가 끝=================

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => AwbGroup, (awbGroup) => awbGroup.awbs)
  AwbGroup?: Relation<AwbGroup> | number;

  @ManyToOne(
    () => AircraftSchedule,
    (aircraftSchedule) => aircraftSchedule.Awbs,
  )
  AirCraftSchedule?: Relation<AircraftSchedule> | number;

  @OneToMany(() => BuildUpOrder, (buildUpOrder) => buildUpOrder.Awb)
  BuildUpOrders: Relation<BuildUpOrder[]>;

  @OneToMany(() => SimulatorHistory, (simulatorHistory) => simulatorHistory.Awb)
  SimulatorHistories: Relation<SimulatorHistory[]>;

  @OneToMany(() => AsrsHistory, (asrsHistory) => asrsHistory.Awb)
  AsrsHistories: Relation<AsrsHistory[]>;

  @OneToMany(() => AsrsOutOrder, (asrsOutOrder) => asrsOutOrder.Awb)
  AsrsOutOrders: Relation<AsrsOutOrder[]>;

  @OneToMany(
    () => SkidPlatformHistory,
    (skidPlatformHistory) => skidPlatformHistory.Awb,
  )
  SkidPlatformHistories: Relation<SkidPlatformHistory[]>;

  @OneToMany(() => UldHistory, (uldHistory) => uldHistory.BuildUpOrder)
  uldHistories: Relation<UldHistory[]>;

  @OneToMany(
    () => SimulatorResultAwbJoin,
    (simulatorResultAwbJoin) => simulatorResultAwbJoin.Awb,
  )
  srJoin: Relation<SimulatorResultAwbJoin[]>;

  @ManyToMany(() => SimulatorResult, (simulatorResult) => simulatorResult.Awb, {
    cascade: true,
  })
  @JoinTable({
    name: 'simulator_result_awb_join',
    joinColumn: {
      name: 'awb_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'simulator_result_id',
      referencedColumnName: 'id',
    },
  })
  SimulatorResult: SimulatorResult[];

  @OneToMany(() => TimeTable, (timeTable) => timeTable.Awb)
  TimeTables: Relation<TimeTable[]>;

  @ManyToMany(() => Scc, (scc) => scc.Awb, { cascade: true })
  @JoinTable({
    name: 'awb_scc_join',
    joinColumn: {
      name: 'awb_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'scc_id',
      referencedColumnName: 'id',
    },
  })
  Scc: Scc[];

  @OneToMany(() => AwbReturn, (awbReturn) => awbReturn.Awb)
  AwbReturns: Relation<AwbReturn[]>;
}

export const AwbAttribute = {
  id: true,
  name: true,
  prefab: true,
  waterVolume: true,
  squareVolume: true,
  width: true,
  length: true,
  depth: true,
  weight: true,
  isStructure: true,
  barcode: true,
  destination: true,
  source: true,
  breakDown: true,
  piece: true,
  state: true,
  parent: true,
  modelPath: true,
  simulation: true,
  dataCapacity: true,
  flight: true,
  from: true,
  airportArrival: true,
  path: true,
  spawnRatio: true,
  description: true,
  rmComment: true,
  localTime: true,
  localInTerminal: true,
  createdAt: true,
};
