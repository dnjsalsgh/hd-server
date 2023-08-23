import { ApiProperty } from '@nestjs/swagger';

export class CreateAwbBreakDownDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: '해포되는 awb의 id',
  })
  awbs: number[];
}
