import { ApiProperty } from '@nestjs/swagger';

interface VertexCord {
  t1?: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
  t2?: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
  // 추가 필요한 속성들을 여기에 추가할 수 있습니다.
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

interface Uld {
  id: number;
  code: string;
  width: number;
  length: number;
  depth: number;
  uldType: string;
  vertexCord: VertexCord;
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

interface palletRack {
  id: number;
  name: string;
  width: number;
  length: number;
  depth: number;
  waterVolume: number;
  weight: number;
  SCCs: string[];
}

interface Awbs {
  id: number;
  name: string;
  storageId: number;
  width: number;
  length: number;
  depth: number;
  waterVolume: number;
  weight: number;
  SCCs: string[];
}

export class userSelectInput {
  mode: string;
  inputAWB: InputAWB;
  Ulds: Uld[];
  currentAWBsInULD: CurrentAWB[];
  palletRack: palletRack[];
  Awb: Awbs[];
  @ApiProperty({
    example: 'testUld001',
    description: 'Uld의 code',
  })
  UldCode: string;

  @ApiProperty({
    example: true,
    description: '시뮬레이션, 커넥티드 모드 분기',
  })
  simulation: boolean;

  @ApiProperty({
    example: 1653,
    description: '사용자가 선택한 Awb의 Id',
  })
  id: number;

  @ApiProperty({
    example: 1,
    description: '사용자가 선택한 안착대 Id',
  })
  palletRackId: number;

  @ApiProperty({
    example: '18037499582',
    description: '사용자가 선택한 Awb의 이름',
  })
  name: string;
  @ApiProperty({
    example: 26,
    description: '사용자가 선택한 Awb의 width',
  })
  width: number;
  @ApiProperty({
    example: 28,
    description: '사용자가 선택한 Awb의 length',
  })
  length: number;
  @ApiProperty({
    example: 36,
    description: '사용자가 선택한 Awb의 depth',
  })
  depth: number;
  @ApiProperty({
    example: 21840,
    description: '사용자가 선택한 Awb의 waterVolume',
  })
  waterVolume: number;
  @ApiProperty({
    example: 21.877,
    description: '사용자가 선택한 Awb의 weight',
  })
  weight: number;
  @ApiProperty({
    example: ['CAO'],
    description: '사용자가 선택한 Awb의 SCCs',
  })
  SCCs: [];
}

export class awbInPalletRackResultRequest {
  @ApiProperty({
    example: 'A-Type2',
    description: 'Uld의 code',
  })
  UldCode: string;
}
