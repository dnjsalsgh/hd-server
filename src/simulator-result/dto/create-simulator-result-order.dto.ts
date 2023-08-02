import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateSimulatorResultOrderDto {
  @ApiProperty({
    example: 1,
    description: '사용할 Uld',
  })
  @IsNotEmpty()
  Uld: number;
}
