import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Aircraft } from '../../aircraft/entities/aircraft.entity';
import { CommonCode } from '../../common-code/entities/common-code.entity';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Awb } from '../../awb/entities/awb.entity';
import { TimeTable } from '../../time-table/entities/time-table.entity';

@Entity()
export class AircraftSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'GEN',
    description: '현지출발시간',
  })
  @IsString()
  @MaxLength(5)
  @Column({ type: 'varchar', length: 500, nullable: false, default: 'GEN' })
  source: string;

  // 피드백 반영 후 새로생긴 칼럼
  @ApiProperty({
    example: '2023-07-10:15:00:00',
    description: '현지출발시간',
  })
  @Column({ type: 'date', nullable: true })
  localDepartureTime: string;

  @ApiProperty({
    example: '2023-07-14:15:00:00',
    description: '한국도착시간',
  })
  @Column({ type: 'date', nullable: true })
  koreaArrivalTime: string;

  @ApiProperty({
    example: '2023-07-14:13:00:00',
    description: '작업시작시간',
  })
  @Column({ type: 'date', nullable: true })
  workStartTime: string;

  @ApiProperty({
    example: '2023-07-15:13:00:00',
    description: '작업완료목표시간',
  })
  @Column({ type: 'date', nullable: true })
  workCompleteTargetTime: string;

  @ApiProperty({
    example: '2023-07-15:13:00:00',
    description: '한국출항시간',
  })
  @Column({ type: 'date', nullable: true })
  koreaDepartureTime: string;

  @ApiProperty({
    example: '2023-07-15:13:00:00',
    description: '현지도착시간',
  })
  @Column({ type: 'date', nullable: true })
  localArrivalTime: string;

  @ApiProperty({
    example: ['GEN', 'TEL', 'QRL'],
    description: '경유지',
  })
  @Column({ type: 'text', array: true, nullable: true })
  waypoint: string[];

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

  // commonCode의 일방향 관계설정
  // @ManyToOne(() => CommonCode, (commonCode) => commonCode.aircraftSchedules)
  // @ManyToOne(() => CommonCode, (commonCode) => commonCode.id)
  @ApiProperty({
    example: 1,
    description: '목적지FK',
    type: () => CommonCode,
  })
  @IsNotEmpty()
  @ManyToOne(() => CommonCode, {
    nullable: false,
  })
  @JoinColumn({ name: 'cc_id_destination' }) // 원하는 컬럼 이름을 지정합니다.
  CcIdDestination: Relation<CommonCode> | number;

  @ApiProperty({
    example: 1,
    description: '출발지FK',
    type: () => CommonCode,
  })
  @IsNotEmpty()
  @ManyToOne(() => CommonCode, {
    nullable: false,
  })
  @JoinColumn({ name: 'cc_id_departure' }) // 원하는 컬럼 이름을 지정합니다.
  CcIdDeparture: Relation<CommonCode> | number;

  @ApiProperty({
    example: 1,
    description: '타임 테이블 FK',
    type: () => TimeTable,
  })
  @OneToMany(() => TimeTable, (timeTable) => timeTable.AircraftSchedule)
  TimeTables: Relation<TimeTable[]>;
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
};
