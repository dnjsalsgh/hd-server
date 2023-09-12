import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Uld } from '../../uld/entities/uld.entity';
import { Amr } from '../../amr/entities/amr.entity';
import { Awb } from '../../awb/entities/awb.entity';
import { ApiProperty } from '@nestjs/swagger';
import { AircraftSchedule } from '../../aircraft-schedule/entities/aircraft-schedule.entity';

@Entity()
export class TimeTable {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '{ test: 1 }',
    description: '이력데이터',
  })
  @Column({ type: 'jsonb' })
  data: unknown;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ApiProperty({
    example: 1,
    description: 'ULD FK',
    type: () => Uld,
  })
  @ManyToOne(() => Uld, (uld) => uld.timeTables)
  Uld: Relation<Uld> | number;

  @ApiProperty({
    example: 1,
    description: 'AMR FK',
    type: () => Amr,
  })
  @ManyToOne(() => Amr, (amr) => amr.timeTables)
  Amr: Relation<Amr> | number;

  @ApiProperty({
    example: 1,
    description: '화물 FK',
  })
  @ManyToOne(() => Awb, (awb) => awb.TimeTables)
  Awb: Relation<Awb> | number;

  @ApiProperty({
    example: 1,
    description: '항공편 FK',
  })
  @ManyToOne(
    () => AircraftSchedule,
    (aircraftSchedule) => aircraftSchedule.TimeTables,
  )
  AircraftSchedule: Relation<AircraftSchedule> | number;
}
