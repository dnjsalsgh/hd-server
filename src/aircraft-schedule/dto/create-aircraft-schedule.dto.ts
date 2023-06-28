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

  // @ApiProperty({
  //   example: '1',
  //   description: '항공기Id',
  // })
  // aircraft: number;
  //
  // @ApiProperty({
  //   example: '1',
  //   description: '목적지Id',
  // })
  // ccIdDestination: number;
}
