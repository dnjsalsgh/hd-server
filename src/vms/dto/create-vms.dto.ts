export class CreateVmsDto {
  VWMS_ID: string;
  AWB_NUMBER: string;
  SEPARATION_NO: number;
  MEASUREMENT_COUNT: number;
  FILE_NAME: string;
  FILE_PATH: string;
  // FILE_EXTENSION: string;
  FILE_SIZE: number;
  RESULT_TYPE: string;
  LENGTH: number;
  WIDTH: number;
  HEIGHT: number;
  WEIGHT: number;
  WATER_VOLUME: number;
  CUBIC_VOLUME: number;
  STATUS?: string;
  STATUS_RATE?: number;
  STATUS_DESC?: string;
  CREATE_USER_ID?: string;
  CREATE_DATE?: string;
  // 테스트용
  waterVolume?: number;
  Sccs?: string;
}
