import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Alarm {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '123497985',
    description: '설비명',
  })
  @Column({ nullable: true })
  equipmentName: string;

  @ApiProperty({
    example: new Date(),
    description: '조치시간',
  })
  @Column({ type: 'timestamp', nullable: true })
  responseTime?: Date;

  @ApiProperty({
    example: new Date(),
    description: '중단 시간',
  })
  @Column({ type: 'timestamptz', nullable: true })
  stopTime: Date;

  @ApiProperty({
    example: 1,
    description: '발생횟수',
  })
  @Column({ nullable: true })
  count: number;

  @ApiProperty({
    example: '알람 발생했습니다.',
    description: '알람 메세지',
  })
  @Column({ type: 'text', nullable: true })
  alarmMessage: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date | null;
}
