import { ApiProperty } from '@nestjs/swagger';

export class CreateAircraftScheduleDto {
  @ApiProperty({
    example: 'test',
    description: '코드',
  })
  code: string;
  @ApiProperty({
    example: 'GEN',
    description: '출처',
  })
  source: string;
}
