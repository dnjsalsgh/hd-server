import { ApiProperty, PickType } from '@nestjs/swagger';
import { SimulatorResult } from '../entities/simulator-result.entity';
import { IsNotEmpty } from 'class-validator';

export class CreateSimulatorResultDto extends PickType(SimulatorResult, [
  'startDate',
  'endDate',
  'loadRate',
  'version',
  'simulation',
  'Uld',
]) {
  @ApiProperty({
    example: [1, 2, 3],
    description: '사용된 awb의 Id',
  })
  @IsNotEmpty()
  Awbs?: number[];
}
