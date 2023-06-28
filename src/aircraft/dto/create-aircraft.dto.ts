import { ApiProperty } from '@nestjs/swagger';

export class CreateAircraftDto {
  @ApiProperty({
    example: 'test',
    description: '항공기 이름',
  })
  name: string;
  @ApiProperty({
    example: 'test',
    description: '코드',
  })
  code: string;
  @ApiProperty({
    example: '{full}',
    description: '항공기 정보',
  })
  info: JSON;
}
