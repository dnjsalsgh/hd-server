import { ApiProperty, PickType } from '@nestjs/swagger';
import { AwbReturn } from '../entities/awb-return.entity';
import { Awb } from '../../awb/entities/awb.entity';

export class CreateAwbReturnDto extends PickType(AwbReturn, [
  // 'Awb'
  'description',
]) {
  @ApiProperty({
    example: 1,
    description: '화물 FK',
  })
  Awb: Partial<Awb>;
}
