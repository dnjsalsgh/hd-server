import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'VWMS_2D_RAW_DATA' })
export class Vms2d {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '화물-001',
    description: '화물의 이름',
  })
  @Column({ name: 'AWB_NUMBER', type: 'nvarchar', length: 100, nullable: true })
  name: string;

  @ApiProperty({
    example: 0,
    description: '화물 분리 번호',
  })
  @Column({
    name: 'SEPARATION_NO',
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
    name: 'CREATE_USER_ID',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  CREATE_USER_ID: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
