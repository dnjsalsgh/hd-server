import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AircraftSchedule } from '../../aircraft-schedule/entities/aircraft-schedule.entity';

@Entity()
export class CommonCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  code: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  masterCode: string;

  @Column({ type: 'int', nullable: false, default: 0 })
  level: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  orderdy: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  type: string;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  // @OneToMany(
  //   () => AircraftSchedule,
  //   (aircraftSchedule) => aircraftSchedule.commonCode,
  // )
  // aircraftSchedules: AircraftSchedule[];
}
