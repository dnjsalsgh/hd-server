import { ApiProperty, PickType } from '@nestjs/swagger';
import { AsrsHistory } from '../entities/asrs-history.entity';

export class CreateAsrsHistoryDto extends PickType(AsrsHistory, [
  // 'Asrs',
  // 'Awb',
  'inOutType',
  'count',
]) {
  @ApiProperty({
    example: '창고1',
    description: '창고 이름',
  })
  Asrs: string | number;

  @ApiProperty({
    example: '18037503115',
    description: '화물 이름',
  })
  Awb: string | number;
}
