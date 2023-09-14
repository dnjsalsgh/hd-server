interface AWBInfo {
  AwbId: number;
  SCCs: string[];
  coordinate: {
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
  }[];
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

interface PalletRackRatioItem {
  SkidPlatformId: number;
  waterVolumeRatio: string;
  squareVolumeRatio: string;
}

interface PalletRackResultItem {
  AWBInfoList: AWBInfo[];
  AWBsSquareVolume: number;
  AWBsWaterVolume: number;
  AWBsWeight: number;
  UldId: number;
  squareVolumeRatio: string;
  uldVolume: string;
  waterVolumeRatio: string;
}

export interface awbInPalletRackResult {
  code: number;
  result: {
    palletRackRatio: PalletRackRatioItem[];
    palletRackResult: PalletRackResultItem[][];
  }[];
  state: string;
}
