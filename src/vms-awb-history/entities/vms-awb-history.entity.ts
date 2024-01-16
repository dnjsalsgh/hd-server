import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'VWMS_AWB_HISTORY' })
export class VmsAwbHistory {
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

  @ApiProperty({
    example: 0,
    description: '출항 일자',
  })
  @Column({
    name: 'LOCAL_STD_DATE',
    type: 'varchar',
    length: 8,
    nullable: true,
  })
  LOCAL_STD_DATE: string;

  @ApiProperty({
    example: 0,
    description: '항공편 번호',
  })
  @Column({
    name: 'FLIGHT_NUMBER',
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  FLIGHT_NUMBER: string;

  @ApiProperty({
    example: 0,
    description: '화물 수량',
  })
  @Column({
    name: 'CGO_PC',
    type: 'int',
    nullable: true,
  })
  CGO_PC: number;

  @ApiProperty({
    example: 0,
    description: '화물 부피',
  })
  @Column({
    name: 'CGO_VOLUME',
    type: 'float',
    nullable: true,
  })
  CGO_VOLUME: number;

  @ApiProperty({
    example: 0,
    description: '화물 무게',
  })
  @Column({
    name: 'CGO_WEIGHT',
    type: 'float',
    nullable: true,
  })
  CGO_WEIGHT: number;

  @ApiProperty({
    example: 0,
    description: '측정 화물 수량(결과)',
  })
  @Column({
    name: 'RESULT_PC',
    type: 'int',
    nullable: true,
  })
  RESULT_PC: number;

  @ApiProperty({
    example: 0,
    description: '측정 길이(결과)\n',
  })
  @Column({
    name: 'RESULT_LENGTH',
    type: 'float',
    nullable: true,
  })
  RESULT_LENGTH: number;

  @ApiProperty({
    example: 0,
    description: '측정 너비(결과)\n',
  })
  @Column({
    name: 'RESULT_WIDTH',
    type: 'float',
    nullable: true,
  })
  RESULT_WIDTH: number;

  @ApiProperty({
    example: 0,
    description: '측정 높이(결과)\n',
  })
  @Column({
    name: 'RESULT_HEIGHT',
    type: 'float',
    nullable: true,
  })
  RESULT_HEIGHT: number;

  @ApiProperty({
    example: 0,
    description: '측정 워터 볼륨(결과)',
  })
  @Column({
    name: 'RESULT_WATER_VOLUME',
    type: 'int',
    nullable: true,
  })
  RESULT_WATER_VOLUME: number;

  @ApiProperty({
    example: 0,
    description: '측정 큐빅 볼륨(결과)',
  })
  @Column({
    name: 'RESULT_CUBIC_VOLUME',
    type: 'int',
    nullable: true,
  })
  RESULT_CUBIC_VOLUME: number;

  @ApiProperty({
    example: 0,
    description: '측정 무게(결과)',
  })
  @Column({
    name: 'RESULT_WEIGHT',
    type: 'float',
    nullable: true,
  })
  RESULT_WEIGHT: number;

  @ApiProperty({
    example: 0,
    description: '계산 밀도(결과)',
  })
  @Column({
    name: 'RESULT_DENSITY',
    type: 'float',
    nullable: true,
  })
  RESULT_DENSITY: number;

  // @ApiProperty({
  //   example: 0,
  //   description: '일반스키드 여부',
  // })
  // @Column({
  //   name: 'G_SKID_ON',
  //   type: 'varchar',
  //   length: 1,
  //   nullable: true,
  // })
  // G_SKID_ON: string;

  // @ApiProperty({
  //   example: 0,
  //   description: '전용스키드 여부',
  // })
  // @Column({
  //   name: 'D_SKID_ON',
  //   type: 'varchar',
  //   length: 1,
  //   nullable: true,
  // })
  // D_SKID_ON: string;

  @ApiProperty({
    example: 0,
    description: '화물 상태',
  })
  @Column({
    name: 'CRO_STATUS',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  CRO_STATUS: string;

  @ApiProperty({
    example: 0,
    description: '대기열 컨펌자 ID',
  })
  @Column({
    name: 'IN_USER_ID',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  IN_USER_ID: string;

  @ApiProperty({
    example: 0,
    description: '대기열 컨펌 일자',
  })
  @Column({
    name: 'IN_DATE',
    type: 'varchar',
    length: 14,
    nullable: true,
  })
  IN_DATE: string;

  @ApiProperty({
    example: 0,
    description: '출고자 ID',
  })
  @Column({
    name: 'OUT_USER_ID',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  OUT_USER_ID: string;

  @ApiProperty({
    example: 0,
    description: '출고일자',
  })
  @Column({
    name: 'OUT_DATE',
    type: 'varchar',
    length: 14,
    nullable: true,
  })
  OUT_DATE: string;
}
