import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Uld } from '../../uld/entities/uld.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class UldType {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'uldType-001',
    description: '고유code',
  })
  @Column({ type: 'varchar', length: 50, nullable: false })
  code: number;

  @ApiProperty({
    example: 'uld-A',
    description: 'uld 이름',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string;

  @ApiProperty({
    example: 1.0,
    description: '워터볼륨',
  })
  @Column({ type: 'double precision', nullable: true })
  waterVolume: number;

  @ApiProperty({
    example: 1.0,
    description: '스퀘어볼륨',
  })
  @Column({ type: 'double precision', nullable: true })
  squareVolume: number;

  @ApiProperty({
    example: 1.0,
    description: '폭',
  })
  @Column({ type: 'double precision', nullable: true })
  width: number;

  @ApiProperty({
    example: 1.0,
    description: '높이',
  })
  @Column({ type: 'double precision', nullable: true })
  height: number;

  @ApiProperty({
    example: 1.0,
    description: '길이',
  })
  @Column({ type: 'double precision', nullable: true })
  length: number;

  @ApiProperty({
    example: 1.0,
    description: '용량',
  })
  @Column({ type: 'double precision', nullable: true })
  capacity: number;

  @ApiProperty({
    example: '/c/src/xxx',
    description: '모델파일경로',
  })
  @Column({ type: 'varchar', length: 500, nullable: true })
  modelPath: string;

  @ApiProperty({
    example: '{ x1: (0,2,0), x2: (1,2,3), x3:(5,6,4) }',
    description: '꼭지점좌표, 바닥부터 시계방향으로 0부터 시작',
  })
  @Column({ type: 'json', nullable: true })
  vertexCord: JSON;

  // 피드백 반영 후 새로생긴 칼럼
  @ApiProperty({
    example: 1.0,
    description: '스키드 무게',
  })
  @Column({ type: 'double precision', nullable: true })
  squareWeight: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => Uld, (uld) => uld.uldType)
  ulds: Uld[];
}
