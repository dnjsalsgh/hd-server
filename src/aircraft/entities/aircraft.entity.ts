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
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Aircraft {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 50, nullable: true })
  @ApiProperty({
    example: 'test',
    description: '항공기 이름',
  })
  name: string;

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 50, nullable: false })
  @ApiProperty({
    example: 'test',
    description: '고유코드',
  })
  code: string;

  @Column({ type: 'jsonb', nullable: false })
  @ApiProperty({
    example: '{ test: test }',
    description: '항공기 정보',
  })
  info: unknown;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => AircraftSchedule, (aircraftSchedule) => aircraftSchedule.Aircraft)
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
