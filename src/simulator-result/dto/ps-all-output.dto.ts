interface Coordinate {
  p1x: string | number;
  p1y: string | number;
  p1z: string | number;
  p2x: string | number;
  p2y: string | number;
  p2z: string | number;
  p3x: string | number;
  p3y: string | number;
  p3z: string | number;
  p4x: string | number;
  p4y: string | number;
  p4z: string | number;
  p5x: string | number;
  p5y: string | number;
  p5z: string | number;
  p6x: string | number;
  p6y: string | number;
  p6z: string | number;
  p7x: string | number;
  p7y: string | number;
  p7z: string | number;
  p8x: string | number;
  p8y: string | number;
  p8z: string | number;
}

interface AWBInfo {
  AwbId: number;
  SCCs: string[];
  coordinate: Coordinate[];
  depth: string;
  length: string;
  name: string;
  order: number;
  squareVolume: string;
  storageId: number;
  waterVolume: number;
  weight: string;
  width: string;
}

interface UnpackItem {
  id: number;
  name: string;
}

interface PsAllResult {
  AWBInfoList: AWBInfo[];
  AWBsSquareVolume: number;
  AWBsWaterVolume: number;
  AWBsWeight: number;
  UldId: number;
  isDone: boolean;
  squareVolumeRatio: string;
  uldVolume: string;
  unpackItems: UnpackItem[];
  version: number;
  waterVolumeRatio: string;
}

interface PsAllResponse {
  code: number;
  mode: boolean;
  result: PsAllResult[];
  state: string;
}
