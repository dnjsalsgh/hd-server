import { ApiProperty } from '@nestjs/swagger';

export class ManageUldCountDto {
  @ApiProperty({
    example: 1,
    description: 'aircraftSchedule의 id',
  })
  AircraftScheduleId: number;
}
