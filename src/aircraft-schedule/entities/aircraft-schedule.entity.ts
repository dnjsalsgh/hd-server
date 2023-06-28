import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
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

  @Column({ type: 'varchar', length: 5, nullable: false })
  source: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => Aircraft, (aircraft) => aircraft.aircraftSchedules)
  aircraft: Aircraft;

  // commonCode의 일방향 관계설정
  // @ManyToOne(() => CommonCode, (commonCode) => commonCode.aircraftSchedules)
  @ManyToOne(() => CommonCode, (commonCode) => commonCode.id)
  commonCode: CommonCode;
}
