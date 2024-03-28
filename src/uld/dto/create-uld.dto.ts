import { ApiProperty, PickType } from '@nestjs/swagger';
import { Uld } from '../entities/uld.entity';
import { UldType } from '../../uld-type/entities/uld-type.entity';

export class CreateUldDto extends PickType(Uld, [
  'code',
  'prefab',
  'airplaneType',
  'simulation',
  'boundaryPrefab',
  'loadRate',
  'createdAt',
  // 'UldType',
]) {
  @ApiProperty({
    example: 'SCA_Type1',
    description: 'Uld 타입 코드',
  })
  UldType: Partial<UldType> | string | number;

  @ApiProperty({
    example: 1,
    description: '항공편',
  })
  AircraftSchedule?: number;
}
