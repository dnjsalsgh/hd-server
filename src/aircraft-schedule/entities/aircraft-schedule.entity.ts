import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Aircraft } from '../../aircraft/entities/aircraft.entity';
import { CommonCode } from '../../common-code/entities/common-code.entity';

@Entity()
export class AircraftSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 5, nullable: false, default: 'GEN' })
  source: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => Aircraft, (aircraft) => aircraft.AircraftSchedules, {
    nullable: false,
  })
  Aircraft: Aircraft;

  // commonCode의 일방향 관계설정
  // @ManyToOne(() => CommonCode, (commonCode) => commonCode.aircraftSchedules)
  // @ManyToOne(() => CommonCode, (commonCode) => commonCode.id)
  @ManyToOne(() => CommonCode, {
    nullable: false,
  })
  @JoinColumn({ name: 'cc_id_destination' }) // 원하는 컬럼 이름을 지정합니다.
  CcIdDestination: CommonCode;
}

export class AircraftAttributes {}
