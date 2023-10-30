import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({
    example: '화물-001',
    description: '화물의 이름',
  })
  @Column({
    name: 'SEPARATION_NUMBER',
    type: 'int',
    nullable: true,
  })
  separationNumber: boolean;

  @Column({ name: 'FILE_NAME', type: 'nvarchar', length: 17, nullable: true })
  FILE_NAME: string;

  @ApiProperty({
    example: '',
    description: '모델파일 경로',
  })
  @Column({ name: 'FILE_PATH', type: 'nvarchar', length: 1024, nullable: true })
  modelPath: string;

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

  // scc가 string으로 들어오는대신 ,로 구분되어진다고 가정
  @ApiProperty({
    example: ['REG', 'GEN'],
    description: 'scc들',
  })
  @Column({ type: 'varchar', length: 500, nullable: true })
  Sccs: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
