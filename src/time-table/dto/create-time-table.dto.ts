import { ApiProperty, PickType } from '@nestjs/swagger';
import { TimeTable } from '../entities/time-table.entity';

export class CreateTimeTableDto extends PickType(TimeTable, ['data']) {
  @ApiProperty({
    example: 1,
    description: '사용할 Uld Id',
  })
  Uld?: number;

  @ApiProperty({
    example: 1,
    description: '사용할 Amr Id',
  })
  Amr?: number;

  @ApiProperty({
    example: 1,
    description: '사용할 Awb Id',
  })
  Awb?: number;

  @ApiProperty({
    example: 1,
    description: '사용할 항공편 Id',
  })
  AircraftSchedule?: number;
}
