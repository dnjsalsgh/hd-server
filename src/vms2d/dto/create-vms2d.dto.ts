export class CreateVms2dDto {
  VWMS_ID: string;
  AWB_NUMBER: string;
  SEPARATION_NO: number;
  FILE_NAME: string;
  CAMERA_2D_ID?: string;
  CAMERA_3D_ID?: string;
  FILE_PATH: string;
  FILE_EXTENSION: string;
  FILE_SIZE: number;
  STATUS?: string;
  STATUS_DESC?: string;
  CALIBRATION_ID: string;
  CREATE_USER_ID: string;
  CREATE_DATE: string;
}
