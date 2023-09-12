import { ApiProperty } from '@nestjs/swagger';

export interface UldCoordinate {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Uld {
  id: number;
  code: string;
  width: number;
  length: number;
  depth: number;
  maxWeight: number;
  uldType: string;
  trimmerCoordinate: UldCoordinate[];
}

export interface Awb {
  AWBNumber: number;
  storageId?: number;
  code: string;
  width: number;
  length: number;
  depth: number;
  waterVolume: number;
  weight: number;
  SCCs: string[];
  iceWeight: number;
  partno?: string;
  name?: string;
  typeof?: string;
  level?: number;
  updown?: string;
  color?: string;
}

export class PsApiRequest {
  mode: string;
  // ULDs: Uld[];
  // AWBs: Awb[];
  @ApiProperty({
    example: 'A-Type2',
    description: 'Uld의 code',
  })
  UldCode: string;
  @ApiProperty({
    example: true,
    description: '시뮬레이션 모드 확인',
  })
  simulation: boolean;
  prohibitionListSCCs: string[][];
}
