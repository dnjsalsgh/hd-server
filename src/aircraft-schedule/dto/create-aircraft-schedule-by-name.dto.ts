import { ApiProperty, PickType } from '@nestjs/swagger';
import { AircraftSchedule } from '../entities/aircraft-schedule.entity';
import { Awb } from '../../awb/entities/awb.entity';
import { CreateAwbWithAircraftDto } from '../../awb/dto/create-awb-with-aircraft.dto';
import { CreateAwbDto } from '../../awb/dto/create-awb.dto';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Column } from 'typeorm';
import { Uld } from '../../uld/entities/uld.entity';

export class CreateAircraftScheduleByNameDto extends PickType(
  AircraftSchedule,
  [
    'source',
    'localDepartureTime',
    'koreaArrivalTime',
    'workStartTime',
    'workCompleteTargetTime',
    'koreaDepartureTime',
    'localArrivalTime',
    'waypoint',
    'destination',
    'departure',
    // 'Aircraft',
    // 'CcIdDestination',
    // 'CcIdDeparture',
  ],
) {
  @ApiProperty({
    example: 'B777F',
    description: '항공기 이름',
  })
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'B777F',
    description: '고유코드',
  })
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    example: {},
    description: '항공기 정보',
  })
  info: unknown;

  // 피드백 반영 후 새로생긴 칼럼
  @ApiProperty({
    example: true,
    description: '허용가능',
  })
  allow: boolean;

  @ApiProperty({
    example: true,
    description: '허용가능 드라이아이스',
  })
  allowDryIce: boolean;
  @ApiProperty({
    example: 'KOR',
    description: '출발지',
  })
  CcIdDestination: string;

  @ApiProperty({
    example: 'ORD',
    description: '도착지',
  })
  CcIdDeparture: string;

  @ApiProperty({
    example:
      '[    {\n' +
      '      "code": "AKE 12345 KE",\n' +
      '      "width": 243.8,\n' +
      '      "length": 317.5,\n' +
      '      "depth": 243.8,\n' +
      '      "UldType": "SCA",\n' +
      '      "vertexCord": { "t1" : { "x1": 197.6 , "y1": 243.8 , "x2": 243.8 , "y2": 198.2 } }\n' +
      '    }]',
    description: '입력된 화물들',
  })
  Ulds?: Uld[];

  // @ApiProperty({
  //   example: 'GEN',
  //   description: '출처',
  // })
  // source: string;
  // @ApiProperty({
  //   example: '4',
  //   description: '항공기 FK',
  // })
  // Aircraft: Aircraft;
  // @ApiProperty({
  //   example: '31',
  //   description: '공통코드 FK',
  // })
  // CcIdDestination: CommonCode;
  // @ApiProperty({
  //   example: '1',
  //   description: '항공기Id',
  // })
  // aircraft: number;
}
