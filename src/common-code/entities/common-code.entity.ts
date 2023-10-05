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
export class CommonCode {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '공통code',
    description: '공통코드',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string;

  @ApiProperty({
    example: '공통code',
    description: '고유code',
  })
  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  code: string;

  @ApiProperty({
    example: '공통code',
    description: '부모코드',
  })
  @Column({ type: 'varchar', length: 50, nullable: false })
  masterCode: string;

  @ApiProperty({
    example: 0,
    description: '트리 깊이',
  })
  @Column({ type: 'int', nullable: false, default: 0 })
  level: number;

  @ApiProperty({
    example: 0,
    description: '트리 순서',
  })
  @Column({ type: 'int', nullable: false, default: 0 })
  orderdy: number;

  @ApiProperty({
    example: 'system',
    description: 'user, system 타입 설정',
  })
  @Column({ type: 'varchar', length: 20, nullable: true })
  type: string;

  @ApiProperty({
    example: '상세설명',
    description: '상세설명',
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
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
