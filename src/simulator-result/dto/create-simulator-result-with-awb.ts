import { ApiProperty, PickType } from '@nestjs/swagger';
import { SimulatorResult } from '../entities/simulator-result.entity';
import { Awb } from '../../awb/entities/awb.entity';
import { IsNotEmpty } from 'class-validator';

export class CreateSimulatorResultWithAwbAndHistoryDto extends PickType(
  SimulatorResult,
  ['startDate', 'endDate', 'loadRate', 'version', 'Uld'],
) {
  @IsNotEmpty()
  @ApiProperty({
    example: [
      { Awb: 1, x: 10, y: 20, z: 30 },
      { Awb: 2, x: 20, y: 30, z: 40 },
      { Awb: 3, x: 30, y: 40, z: 50 },
    ],
    description: '시뮬레이션에 활용된 화물',
  })
  AwbWithXYZ: [{ Awb: Awb; x: number; y: number; z: number }];
  //
  // @ApiProperty({
  //   example: 1.0,
  //   description: 'x좌표',
  // })
  // x: number;
  //
  // @ApiProperty({
  //   example: 1.0,
  //   description: 'y좌표',
  // })
  // y: number;
  //
  // @ApiProperty({
  //   example: 1.0,
  //   description: 'z좌표',
  // })
  // z: number;
}
