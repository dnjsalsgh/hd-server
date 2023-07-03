import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class CommonCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
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

export const CcIdDestinationAttribute = {
  id: true,
  name: true,
  code: true,
  masterCode: true,
  level: true,
  orderdy: true,
  type: true,
  description: true,
  createdAt: true,
  updatedAt: false,
  deletedAt: false,
};
