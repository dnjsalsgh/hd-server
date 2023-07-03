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
export class Aircraft {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  code: string;

  @Column({ type: 'jsonb', nullable: false })
  info: unknown;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(
    () => AircraftSchedule,
    (aircraftSchedule) => aircraftSchedule.Aircraft,
  )
  AircraftSchedules: AircraftSchedule[];
}

export const AircraftAttribute = {
  id: true,
  name: true,
  code: true,
  info: true,
  createdAt: true,
  updatedAt: false,
  deletedAt: false,
};
