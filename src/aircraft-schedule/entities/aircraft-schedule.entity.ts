import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Aircraft } from '../../aircraft/entities/aircraft.entity';
import { CommonCode } from '../../common-code/entities/common-code.entity';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

@Entity()
export class AircraftSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @MaxLength(5)
  @Column({ type: 'varchar', length: 5, nullable: false, default: 'GEN' })
  source: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @IsNotEmpty()
  @ManyToOne(() => Aircraft, (aircraft) => aircraft.AircraftSchedules, {
    nullable: false,
  })
  Aircraft: Relation<Aircraft>;

  // commonCode의 일방향 관계설정
  // @ManyToOne(() => CommonCode, (commonCode) => commonCode.aircraftSchedules)
  // @ManyToOne(() => CommonCode, (commonCode) => commonCode.id)
  @IsNotEmpty()
  @ManyToOne(() => CommonCode, {
    nullable: false,
  })
  @JoinColumn({ name: 'cc_id_destination' }) // 원하는 컬럼 이름을 지정합니다.
  CcIdDestination: Relation<CommonCode>;
}

export const AircraftScheduleAttributes = {
  id: true,
  source: true,
  createdAt: true,
  updatedAt: false,
  deletedAt: false,
};
