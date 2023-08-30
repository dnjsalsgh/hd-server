class CoordinatePoint {
  p1x: string;
  p1y: string;
  p1z: string;
  p2x: string;
  p2y: string;
  p2z: string;
  p3x: string;
  p3y: string;
  p3z: string;
  p4x: string;
  p4y: string;
  p4z: string;
  p5x: string;
  p5y: string;
  p5z: string;
  p6x: string;
  p6y: string;
  p6z: string;
  p7x: string;
  p7y: string;
  p7z: string;
  p8x: string;
  p8y: string;
  p8z: string;
}

class AWBInfo {
  SCCs: string[];
  coordinate: CoordinatePoint[];
  depth: string;
  length: string;
  AwbId?: number;
  name: string;
  order: number;
  squareVolume: string;
  waterVolume: number;
  weight: string;
  width: string;
  storageId?: number;
}

class AWBGroupResult {
  AWBInfoList: AWBInfo[];
  AWBsSquareVolume: number;
  AWBsWaterVolume: number;
  AWBsWeight: number;
  squareVolumeRatio: string;
  uldVolume: string;
  waterVolumeRatio: string;
  version: number;
  UldId: number;
}

export class PsApiResponse {
  code: number;
  result: AWBGroupResult[];
  state: string;
}
