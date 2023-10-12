import { ApiProperty, PickType } from '@nestjs/swagger';
import { SkidPlatformHistory } from '../entities/skid-platform-history.entity';
import { IsString } from 'class-validator';

export class CreateSkidPlatformHistoryDto extends PickType(
  SkidPlatformHistory,
  [
    // 'AsrsOutOrder',
    // 'Asrs',
    // 'SkidPlatform',
    // 'Awb',
    'inOutType',
    'count',
  ],
) {
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

  @ApiProperty({
    example: 1,
    description: '안착대 이름',
  })
  SkidPlatform: string | number;
}
