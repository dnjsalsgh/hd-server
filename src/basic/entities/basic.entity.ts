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
export class Basic {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'basic 이름',
    description: 'basic의 이름을 말합니다.',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
