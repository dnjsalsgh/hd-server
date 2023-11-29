import { ApiProperty } from '@nestjs/swagger';

interface VertexCord {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
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

interface InputAWB {
  id: number;
  palletRackId: number;
  name: string;
  width: number;
  length: number;
  depth: number;
  waterVolume: number;
  weight: number;
  SCCs: string[];
}

export class UldDeployCheckerRequest {
  mode: boolean;
  inputAWB: InputAWB;
  Ulds: Uld[];
  currentAWBsInULD: CurrentAWB[];

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

  @ApiProperty({
    example: 1653,
    description: '사용자가 선택한 Awb의 Id',
  })
  awbId: number | number[];
}

export class UldDeployCheckerListRequest {
  mode: boolean;
  inputAWB: InputAWB;
  Ulds: Uld[];
  currentAWBsInULD: CurrentAWB[];

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

  @ApiProperty({
    example: [32908, 32900, 32901],
    description: '사용자가 선택한 Awb의 Id들',
  })
  awbIdList: number[];
}
