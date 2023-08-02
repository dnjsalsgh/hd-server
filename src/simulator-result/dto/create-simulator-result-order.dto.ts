import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Awb } from '../../awb/entities/awb.entity';

export class CreateSimulatorResultOrderDto {
  @ApiProperty({
    example: 1,
    description: '사용할 Uld',
  })
  @IsNotEmpty()
  Uld: number;

  @ApiProperty({
    example: [
      {
        Asrs: 1,
        Awb: 1,
      },
      {
        Asrs: 2,
        Awb: 2,
      },
      {
        Asrs: 3,
        Awb: 3,
      },
    ],
    description:
      '패키시 시뮬레이터에서 자동창고 작업자시정보가 이렇게 온다고 가정한 테스트용 객체',
  })
  outOrder: { Asrs: number; Awb: number }[];

  @ApiProperty({ example: new Date(), description: '' })
  startDate: Date;
  @ApiProperty({ example: new Date(), description: '' })
  endDate: Date;
  @ApiProperty({ example: 33, description: '' })
  loadRate: number;
  @ApiProperty({ example: 1.0, description: '' })
  version: number;

  @ApiProperty({
    example: [
      { Awb: 1, SkidPlatform: 1, x: 10, y: 20, z: 30 },
      { Awb: 2, SkidPlatform: 2, x: 20, y: 30, z: 40 },
      { Awb: 3, SkidPlatform: 3, x: 30, y: 40, z: 50 },
    ],
    description: '시뮬레이션에 활용된 화물',
  })
  AwbWithXYZ: {
    Awb: Awb | number;
    SkidPlatform: number;
    x: number;
    y: number;
    z: number;
  }[];
}
