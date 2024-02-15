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
import { Aircraft } from '../../aircraft/entities/aircraft.entity';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Awb } from '../../awb/entities/awb.entity';
import { TimeTable } from '../../time-table/entities/time-table.entity';
import { Uld } from '../../uld/entities/uld.entity';

@Entity()
export class AircraftSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'GEN',
    description: '출처',
  })
  @Column({ type: 'varchar', length: 500, nullable: false, default: 'GEN' })
  source: string;

  @ApiProperty({
    example: 'KE0223',
    description: '항공편 명',
  })
  @Column({ type: 'varchar', length: 500 })
  code: string;

  @ApiProperty({
    example: 'ICN',
    description: '출발지',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  departure: string;

  @ApiProperty({
    example: 'JPN',
    description: '도착지',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  destination: string;

  // 피드백 반영 후 새로생긴 칼럼
  @ApiProperty({
    example: new Date().toISOString(),
    description: '현지출발시간',
  })
  @Column({ type: 'timestamptz', nullable: true })
  localDepartureTime: Date;

  @ApiProperty({
    example: new Date().toISOString(),
    description: '한국도착시간',
  })
  @Column({ type: 'timestamptz', nullable: true })
  koreaArrivalTime: Date;

  @ApiProperty({
    example: new Date().toISOString(),
    description: '작업시작시간',
  })
  @Column({ type: 'timestamptz', nullable: true })
  workStartTime: Date;

  @ApiProperty({
    example: new Date().toISOString(),
    description: '작업완료목표시간',
  })
  @Column({ type: 'timestamptz', nullable: true })
  workCompleteTargetTime: Date;

  @ApiProperty({
    example: new Date().toISOString(),
    description: '한국출항시간',
  })
  @Column({ type: 'timestamptz', nullable: true })
  koreaDepartureTime: Date;

  @ApiProperty({
    example: new Date().toISOString(),
    description: '현지도착시간',
  })
  @Column({ type: 'timestamptz', nullable: true })
  localArrivalTime: Date;

  @ApiProperty({
    example: ['GEN', 'TEL', 'QRL'],
    description: '경유지',
  })
  @Column({ type: 'text', array: true, nullable: true })
  waypoint: string[];

  @ApiProperty({
    example: false,
    description: '항공편 작업이 끝났는지 판단',
  })
  @Column({ type: 'bool', default: false })
  done?: boolean;

  @ApiProperty({
    example: 0,
    description: '',
  })
  @Column({ type: 'int', default: 0 })
  plannedULDCount?: number;

  @ApiProperty({
    example: 0,
    description: '',
  })
  @Column({ type: 'int', default: 0 })
  completedULDCount?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ApiProperty({
    example: 1,
    description: '화물FK',
    type: () => Awb,
  })
  @OneToMany(() => Awb, (awb) => awb.AirCraftSchedule)
  Awbs: Relation<Awb[]> | number;

  @ApiProperty({
    example: 1,
    description: '항공기FK',
    type: () => Aircraft,
  })
  @IsNotEmpty()
  @ManyToOne(() => Aircraft, (aircraft) => aircraft.AircraftSchedules, {
    nullable: false,
  })
  Aircraft: Relation<Aircraft> | number;

  @ApiProperty({
    example: 1,
    description: '타임 테이블 FK',
    type: () => TimeTable,
  })
  @OneToMany(() => TimeTable, (timeTable) => timeTable.AircraftSchedule)
  TimeTables: Relation<TimeTable[]>;

  @ApiProperty({
    example: 1,
    description: 'ULDFK',
    type: () => Uld,
  })
  @OneToMany(() => Uld, (uld) => uld.AircraftSchedule)
  Ulds: Relation<Uld[]> | number;
}

export const AircraftScheduleAttributes = {
  id: true,
  source: true,
  localDepartureTime: true,
  koreaArrivalTime: true,
  workStartTime: true,
  workCompleteTargetTime: true,
  koreaDepartureTime: true,
  localArrivalTime: true,
  waypoint: true,
  createdAt: true,
  plannedULDCount: true,
  completedULDCount: true
};
