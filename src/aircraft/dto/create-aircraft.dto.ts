import { ApiProperty, PickType } from '@nestjs/swagger';
import { Aircraft } from '../entities/aircraft.entity';

export class CreateAircraftDto extends PickType(Aircraft, [
  'name',
  'code',
  'info',
  'allow',
  'allowDryIce',
]) {
  // @ApiProperty({
  //   example: 'test',
  //   description: '항공기 이름',
  // })
  // name: string;
  // @ApiProperty({
  //   example: 'test',
  //   description: '코드',
  // })
  // code: string;
  // @ApiProperty({
  //   example: '{full}',
  //   description: '항공기 정보',
  // })
  // info: JSON;
}
