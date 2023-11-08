import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'VWMS_2D_RAW_DATA' })
export class Vms2d {
  @ApiProperty({
    example: 0,
    description: '설비ID',
  })
  @PrimaryColumn({
    name: 'VWMS_ID',
    type: 'nvarchar',
    length: 20,
    nullable: false,
  })
  VWMS_ID: string;

  @ApiProperty({
    example: '화물-001',
    description: '화물의 이름',
  })
  @PrimaryColumn({
    name: 'AWB_NUMBER',
    type: 'nvarchar',
    length: 100,
    nullable: false,
  })
  AWB_NUMBER: string;

  @ApiProperty({
    example: 0,
    description: '화물 분리 번호',
  })
  @PrimaryColumn({
    name: 'SEPARATION_NO',
    type: 'int',
    nullable: false,
  })
  SEPARATION_NO: number;

  // @ApiProperty({
  //   example: 0,
  //   description: '측정 횟수',
  // })
  // @Column({
  //   name: 'MEASUREMENT_COUNT',
  //   type: 'int',
  //   nullable: true,
  // })
  // MEASUREMENT_COUNT: number;

  @ApiProperty({
    example: '',
    description: '파일 명',
  })
  @PrimaryColumn({
    name: 'FILE_NAME',
    type: 'nvarchar',
    length: 17,
    nullable: false,
  })
  FILE_NAME: string;

  @ApiProperty({
    example: '',
    description: '모델파일 경로',
  })
  @Column({ name: 'FILE_PATH', type: 'nvarchar', length: 1024, nullable: true })
  FILE_PATH: string;

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

  @ApiProperty({
    example: 'F',
    description: '측정상태',
  })
  @Column({ name: 'STATUS', type: 'text', nullable: true })
  STATUS: string;

  @ApiProperty({
    example: '100',
    description: '측정 상태 메시지',
  })
  @Column({
    name: 'STATUS_DESC',
    type: 'nvarchar',
    length: 1000,
    nullable: true,
  })
  STATUS_DESC: string;

  @ApiProperty({
    example: '100',
    description: '생성자',
  })
  @Column({
    name: 'CREATE_USER_ID',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  CREATE_USER_ID: string;

  @ApiProperty({
    example: '100',
    description: '생성일자',
  })
  @Column({
    name: 'CREATE_DATE',
    type: 'varchar',
    length: 14,
    nullable: true,
  })
  CREATE_DATE: string;
}
