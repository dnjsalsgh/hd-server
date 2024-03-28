import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { AmrChargeHistory } from '../../amr-charge-history/entities/amr-charge-history.entity';
import { TimeTable } from '../../time-table/entities/time-table.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class Amr {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Amr-001',
    description: 'Amr 이름',
  })
  @IsNotEmpty()
  @Column({ length: 100, nullable: true, unique: true })
  name: string;

  @ApiProperty({
    example: false,
    description: '충전중 여부',
  })
  @Column({ nullable: true, default: false }) // 이전 배터리 충전량과 비교해서 충전여부 판단하기 때문에 처음에 생기면 무조건 false
  charging: boolean;

  @ApiProperty({
    example: 2,
    description: '로봇모드 (Manual = 0, semiAuto = 1, auto = 2)',
  })
  @Column({ nullable: true })
  mode?: number;

  @ApiProperty({
    example: 'Error found',
    description: '마지막에러의 에러코드',
  })
  @Column({ nullable: true })
  errorCode: string;

  @ApiProperty({
    example: 74,
    description: '배터리SOC(현재 배터리량)',
  })
  @Column({ type: 'int', nullable: true })
  soc?: number;

  @ApiProperty({
    example: 10,
    description: '누적이동거리(m)',
  })
  @Column({ type: 'double precision', nullable: true })
  travelDist: number;

  @ApiProperty({
    example: 10,
    description: '누적운행시간(M)',
  })
  @Column({ type: 'double precision', nullable: true })
  oprTime: number;

  @ApiProperty({
    example: 10,
    description: '누적정지시간(M)',
  })
  @Column({ type: 'double precision', nullable: true })
  stopTime: number;

  @ApiProperty({
    example: 90,
    description: '충전시작 배터리량',
  })
  @Column({ nullable: true })
  startBatteryLevel: number;

  @ApiProperty({
    example: true,
    description: '시뮬레이션 모드',
  })
  @Column({ nullable: true })
  simulation: boolean;

  @ApiProperty({
    example: new Date(),
    description: '데이터 업데이트 일자',
  })
  @Column({ nullable: true })
  logDT: string;

  @ApiProperty({
    example: '인입용',
    description: '인입용, 인출용 구분',
  })
  @Column({ nullable: true })
  distinguish: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => AmrChargeHistory, (amrChargeHistory) => amrChargeHistory.amr)
  amrChargeHistories: Relation<AmrChargeHistory[]>;

  @OneToMany(() => TimeTable, (timeTable) => timeTable.Amr)
  timeTables: Relation<TimeTable[]>;
}

export const AmrAttribute = {
  id: true,
  name: true,
  charging: true,
  mode: true,
  errorCode: true,
  travelDist: true,
  oprTime: true,
  stopTime: true,
  startBatteryLevel: true,
  simulation: true,
  logDT: true,
  distinguish: true,
  createdAt: true,
};
