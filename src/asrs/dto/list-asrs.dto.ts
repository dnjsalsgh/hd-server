import { ApiProperty } from '@nestjs/swagger';

export class ListAsrsDto {
  @ApiProperty({
    example: 1,
    description: 'id',
  })
  id: number;
  @ApiProperty({
    example: 'test',
    description: '창고 위치 이름',
  })
  name: string;
  parent: number;
  level: number;
  @ApiProperty({
    example: 'fullPath',
    description: '창고의 위치',
  })
  fullPath: string;
  @ApiProperty({
    example: 0,
    description: '넣은 순서',
  })
  orderby: number;
  @ApiProperty({
    example: 0,
    description: 'x좌표',
  })
  x: number;
  @ApiProperty({
    example: 0,
    description: 'y좌표',
  })
  y: number;
  @ApiProperty({
    example: 0,
    description: 'z좌표',
  })
  z: number;
  @ApiProperty({
    example: true,
    description: '시뮬레이션 모드 확인',
  })
  simulation: boolean;
}

// {
//   "id": 3,
//   "name": "test",
//   "parent": 0,
//   "level": 0,
//   "fullPath": "fullPath",
//   "orderby": 0,
//   "x": 0,
//   "y": 0,
//   "z": 0,
//   "simulation": true,
//   "createdAt": "2023-06-11T23:06:14.583Z",
//   "updatedAt": "2023-06-11T23:06:14.583Z",
//   "deletedAt": null
// },
