import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

@Entity({ name: 'VWMS_3D_RESULT_DATA' })
export class Vms {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '화물-001',
    description: '화물의 이름',
  })
  @Column({ name: 'AWB_NUMBER', type: 'nvarchar', length: 100, nullable: true })
  name: string;

  @Column({ name: 'FILE_NAME', type: 'nvarchar', length: 17, nullable: true })
  FILE_NAME: string;

  // @Column({ name: 'FILE_PATH', type: 'nvarchar', length: 1024, nullable: true })
  // FILE_PATH: string;

  @Column({
    name: 'FILE_EXTENSION',
    type: 'nvarchar',
    length: 1024,
    nullable: true,
  })
  FILE_EXTENSION: string;

  @Column({
    name: 'FILE_SIZE',
    type: 'int',
    nullable: true,
  })
  FILE_SIZE: number;

  @Column({
    name: 'RESULT_TYPE',
    type: 'bit',
    nullable: true,
  })
  RESULT_TYPE: boolean;

  @ApiProperty({
    example: 1.0,
    description: '워터볼륨',
  })
  @Column({ type: 'float', nullable: true })
  waterVolume: number;

  @ApiProperty({
    example: 1.0,
    description: '폭(x)',
  })
  @Column({ name: 'WIDTH', type: 'float', nullable: true })
  width: number;

  @ApiProperty({
    example: 1.0,
    description: '높이(y)',
  })
  @Column({ name: 'LENGTH', type: 'float', nullable: true })
  length: number;

  @ApiProperty({
    example: 1.0,
    description: '깊이(z)',
  })
  @Column({ name: 'HEIGHT', type: 'float', nullable: true })
  depth: number;

  @ApiProperty({
    example: 1.0,
    description: '중량',
  })
  @Column({ name: 'WEIGHT', type: 'float', nullable: true })
  weight: number;

  @ApiProperty({
    example: 1.0,
    description: '얼음무개',
  })
  @Column({ type: 'int', nullable: true })
  iceWeight: number;

  @ApiProperty({
    example: ['REG', 'GEN'],
    description: 'scc들',
  })
  @Column({ type: 'varchar', length: 500, nullable: true })
  Sccs: string;

  @ApiProperty({
    example: '',
    description: '모델파일 경로',
  })
  @Column({ name: 'FILE_PATH', type: 'nvarchar', length: 1024, nullable: true })
  modelPath: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
