interface Coordinate {
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

interface Result {
  AWBInfoList: AWBInfo[];
  AWBsSquareVolume: number;
  AWBsWaterVolume: number;
  AWBsWeight: number;
  UldId: number;
  moveASRSId: number;
  moveAWBId: number;
  palletRackId: number;
  palletRackStackRatio: string;
  squareVolumeRatio: string;
  uldVolume: string;
  unpackItems: any[]; // 이 부분을 적절한 타입으로 수정해야 합니다.
  predictionResult: AWBInfo[];
  waterVolumeRatio: string;
  version: number;
}

export interface userSelectOutput {
  code: number;
  inputState: string;
  result: Result[];
  state: string;
}
