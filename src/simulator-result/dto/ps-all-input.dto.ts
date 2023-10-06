import { ApiProperty } from '@nestjs/swagger';

interface VertexCord {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface Uld {
  id: number;
  code: string;
  width: number;
  length: number;
  depth: number;
  uldType: string;
  vertexCord?: {
    t1?: VertexCord;
  };
}

interface CurrentAWB {
  id: number;
  name: string;
  width: number;
  length: number;
  depth: number;
  waterVolume: number;
  weight: number;
  SCCs: string[];
}

interface Awb {
  id: number;
  name: string;
  width: number;
  length: number;
  depth: number;
  waterVolume: number;
  weight: number;
  SCCs: string[];
}

export class PsAllRequest {
  mode: boolean;
  Ulds: Uld[];
  currentAWBsInULD: CurrentAWB[];
  palletRack: any[]; // 데이터가 없는 경우 빈 배열로 정의
  Awbs: Awb[];

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
}
