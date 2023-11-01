export class CreateVmsDto {
  AWB_NUMBER: string;
  SEPARATION_NUMBER: number;
  MEASUREMENT_COUNT: number;
  FILE_NAME: string;
  VWMS_ID: string;
  FILE_PATH: string;
  FILE_EXTENSION: string;
  FILE_SIZE: number;
  RESULT_TYPE: string;
  LENGTH: number;
  WIDTH: number;
  HEIGHT: number;
  WEIGHT: number;
  STATUS?: string;
  STATUS_RATE?: number;
  STATUS_DESC?: string;
  CREATE_USER_ID?: string;
  CREATE_DATE?: string;
  // 테스트용
  waterVolume: number;
  Sccs: string;
}
