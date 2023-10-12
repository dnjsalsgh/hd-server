import { ApiProperty, PickType } from '@nestjs/swagger';
import { AsrsHistory } from '../entities/asrs-history.entity';
import { IsString } from 'class-validator';

export class CreateAsrsHistoryDto extends PickType(AsrsHistory, [
  // 'Asrs',
  // 'Awb',
  'inOutType',
  'count',
]) {
  @ApiProperty({
    example: 1,
    description: '창고 이름',
  })
  Asrs: string | number;

  @ApiProperty({
    example: 1,
    description: '화물 이름',
  })
  Awb: string | number;
}
