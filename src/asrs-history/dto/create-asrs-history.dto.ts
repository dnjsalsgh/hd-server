import { ApiProperty, PickType } from '@nestjs/swagger';
import { AsrsHistory } from '../entities/asrs-history.entity';

export class CreateAsrsHistoryDto extends PickType(AsrsHistory, [
  'inOutType',
  'count',
]) {
  @ApiProperty({
    example: 1,
    description: '창고 이름',
  })
  Asrs: number;

  @ApiProperty({
    example: 1,
    description: '화물 이름',
  })
  Awb: number;
}
