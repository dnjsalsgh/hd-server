import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'VWMS_AWB_RESULT' })
export class VmsAwbResult {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 0,
    description: '설비ID',
  })
  @Column({
    name: 'VWMS_ID',
    type: 'nvarchar',
    length: 20,
    nullable: true,
  })
  VWMS_ID: string;

  @ApiProperty({
    example: '화물-001',
    description: '화물의 이름',
  })
  @Column({ name: 'AWB_NUMBER', type: 'nvarchar', length: 100, nullable: true })
  AWB_NUMBER: string;

  // @ApiProperty({
  //   example: 0,
  //   description: '화물 분리 번호',
  // })
  // @Column({
  //   name: 'SEPARATION_NO',
  //   type: 'int',
  //   nullable: true,
  // })
  // SEPARATION_NO: number;

  @ApiProperty({
    example: 0,
    description: '출발 공항 코드',
  })
  @Column({
    name: 'DEPARTURE_CTY_CD',
    type: 'varchar',
    length: 3,
    nullable: true,
  })
  DEPARTURE_CTY_CD: string;

  @ApiProperty({
    example: 0,
    description: '도착 공항 코드',
  })
  @Column({
    name: 'ARRIVAL_CTY_CD',
    type: 'varchar',
    length: 3,
    nullable: true,
  })
  ARRIVAL_CTY_CD: string;

  @ApiProperty({
    example: 0,
    description: '제품 코드',
  })
  @Column({
    name: 'CGO_PRODUCT_NAME',
    type: 'varchar',
    length: 3,
    nullable: true,
  })
  CGO_PRODUCT_NAME: string;

  @ApiProperty({
    example: 0,
    description: 'Special handing code\n scc 정보 있을거라 추정',
  })
  @Column({
    name: 'SPCL_CGO_CD_INFO',
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  SPCL_CGO_CD_INFO: string;

  @ApiProperty({
    example: 0,
    description: '상담원 코드(품명코드)',
  })
  @Column({
    name: 'AGENT_CODE',
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  AGENT_CODE: string;

  @ApiProperty({
    example: 0,
    description: '상담원 이름(품명)',
  })
  @Column({
    name: 'AGENT_ENGLISH_NAME',
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  AGENT_ENGLISH_NAME: string;

  @ApiProperty({
    example: 0,
    description: '대리점 이름',
  })
  @Column({
    name: 'COMMODITY_DESC',
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  COMMODITY_DESC: string;

  @ApiProperty({
    example: 0,
    description: '예약 전체 수량',
  })
  @Column({
    name: 'CGO_TOTAL_PC',
    type: 'int',
    nullable: true,
  })
  CGO_TOTAL_PC: string;

  @ApiProperty({
    example: 0,
    description: '화물 NDS 여부',
  })
  @Column({
    name: 'CGO_NDS',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  CGO_NDS: string;

  @ApiProperty({
    example: 0,
    description: '전체 화물 입고 여부',
  })
  @Column({
    name: 'ALL_PART_RECEIVED',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  ALL_PART_RECEIVED: string;

  @ApiProperty({
    example: 0,
    description: '전체 입고 컨펌자 ID',
  })
  @Column({
    name: 'RECEIVED_USER_ID',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  RECEIVED_USER_ID: string;

  @ApiProperty({
    example: 0,
    description: '전체 입고 일자',
  })
  @Column({
    name: 'RECEIVED_DATE',
    type: 'varchar',
    length: 14,
    nullable: true,
  })
  RECEIVED_DATE: string;
}
