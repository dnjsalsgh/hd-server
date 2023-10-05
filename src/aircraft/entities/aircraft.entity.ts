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
import { AircraftSchedule } from '../../aircraft-schedule/entities/aircraft-schedule.entity';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Aircraft {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'B777F',
    description: '항공기 이름',
  })
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string;

  @ApiProperty({
    example: 'B777F',
    description: '고유코드',
  })
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  code: string;

  @ApiProperty({
    example: '{ "test": "test" }',
    description: '항공기 정보',
  })
  @Column({ type: 'jsonb', nullable: false })
  info: unknown;

  // 피드백 반영 후 새로생긴 칼럼
  @ApiProperty({
    example: true,
    description: '허용가능',
  })
  @Column({ type: 'boolean', nullable: true })
  allow: boolean;

  @ApiProperty({
    example: true,
    description: '허용가능 드라이아이스',
  })
  @Column({ type: 'boolean', nullable: true })
  allowDryIce: boolean;

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
  AircraftSchedules: Relation<AircraftSchedule[]>;
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
