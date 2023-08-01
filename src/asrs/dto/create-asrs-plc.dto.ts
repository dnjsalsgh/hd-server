import { ApiProperty } from '@nestjs/swagger';

export class CreateAsrsPlcDto {
  @ApiProperty({ example: true, description: '인입 컨베이어 시작' })
  In_Conveyor_Start?: boolean;
  @ApiProperty({ example: false, description: '인입 컨베이어 정지' })
  In_Conveyor_Stop?: boolean;
  @ApiProperty({ example: false, description: '인입 컨베이어 파트감지1(시작)' })
  In_Conveyor_Part_OK1?: boolean;
  @ApiProperty({ example: false, description: '인입 컨베이어 파트감지2(끝)' })
  In_Conveyor_Part_OK2?: boolean;
  @ApiProperty({ example: false, description: '인입 컨베이어 종합이상' })
  In_Conveyor_Total_Error?: boolean;
  @ApiProperty({ example: 1, description: '인입 컨베이어 속도' })
  In_Conveyor_Speed?: number;
  @ApiProperty({ example: false, description: '인출 컨베이어 시작' })
  Out_Conveyor_Start?: boolean;
  @ApiProperty({ example: false, description: '인출 컨베이어 정지' })
  Out_Conveyor_Stop?: boolean;
  @ApiProperty({ example: false, description: '인출 컨베이어 파트감지1(시작)' })
  Out_Conveyor_Part_OK1?: boolean;
  @ApiProperty({ example: false, description: '인출 컨베이어 파트감지2(끝)' })
  Out_Conveyor_Part_OK2?: boolean;
  @ApiProperty({ example: false, description: '인출 컨베이어 종합이상' })
  Out_Conveyor_Total_Error?: boolean;
  @ApiProperty({ example: 1, description: '인출 컨베이어 속도' })
  Out_Conveyor_Speed?: number;
  @ApiProperty({ example: false, description: '스태커 크레인 포크 파트감지' })
  Stacker_Part_On?: boolean;
  @ApiProperty({ example: false, description: '스태커 크레인 종합이상' })
  Stacker_Total_Error?: boolean;
  @ApiProperty({ example: false, description: '스태커 크레인 일시정지' })
  Stacker_Pause?: boolean;
  @ApiProperty({ example: false, description: '스태커 크레인 작업대기' })
  Stacker_Work_Wait?: boolean;
  @ApiProperty({ example: false, description: '스태커 크레인 화물 로딩' })
  Stacker_Work_Load?: boolean;
  @ApiProperty({ example: false, description: '스태커 크레인 화물 언로딩' })
  Stacker_Work_Unload?: boolean;
  @ApiProperty({ example: 1, description: '스태커 크레인 속도' })
  Stacker_Speed?: number;
  @ApiProperty({ example: 1, description: '스태커 크레인 X축 위치' })
  Stacker_Position_X?: number;
  @ApiProperty({ example: 1, description: '스태커 크레인 Y축 위치' })
  Stacker_Position_Y?: number;
  @ApiProperty({ example: 1, description: '스태커 크레인 Z축 위치' })
  Stacker_Position_Z?: number;
  @ApiProperty({ example: 1, description: '스태커 크레인 C/T' })
  Stacker_CT?: number;
  @ApiProperty({ example: false, description: 'Rack1 파트감지(LH)' })
  LH_Rack1_Part_On?: boolean;
  @ApiProperty({ example: false, description: 'Rack2 파트감지(LH)' })
  LH_Rack2_Part_On?: boolean;
  @ApiProperty({ example: false, description: 'Rack3 파트감지(LH)' })
  LH_Rack3_Part_On?: boolean;
  @ApiProperty({ example: false, description: 'Rack4 파트감지(LH)' })
  LH_Rack4_Part_On?: boolean;
  @ApiProperty({ example: false, description: 'Rack5 파트감지(LH)' })
  LH_Rack5_Part_On?: boolean;
  @ApiProperty({ example: false, description: 'Rack6 파트감지(LH)' })
  LH_Rack6_Part_On?: boolean;
  @ApiProperty({ example: false, description: 'Rack7 파트감지(LH)' })
  LH_Rack7_Part_On?: boolean;
  @ApiProperty({ example: false, description: 'Rack8 파트감지(LH)' })
  LH_Rack8_Part_On?: boolean;
  @ApiProperty({ example: false, description: 'Rack9 파트감지(LH)' })
  LH_Rack9_Part_On?: boolean;
  @ApiProperty({ example: false, description: 'Rack1 파트감지(RH)' })
  RH_Rack1_Part_On?: boolean;
  @ApiProperty({ example: false, description: 'Rack2 파트감지(RH)' })
  RH_Rack2_Part_On?: boolean;
  @ApiProperty({ example: false, description: 'Rack3 파트감지(RH)' })
  RH_Rack3_Part_On?: boolean;
  @ApiProperty({ example: false, description: 'Rack4 파트감지(RH)' })
  RH_Rack4_Part_On?: boolean;
  @ApiProperty({ example: false, description: 'Rack5 파트감지(RH)' })
  RH_Rack5_Part_On?: boolean;
  @ApiProperty({ example: false, description: 'Rack6 파트감지(RH)' })
  RH_Rack6_Part_On?: boolean;
  @ApiProperty({ example: false, description: 'Rack7 파트감지(RH)' })
  RH_Rack7_Part_On?: boolean;
  @ApiProperty({ example: false, description: 'Rack8 파트감지(RH)' })
  RH_Rack8_Part_On?: boolean;
  @ApiProperty({ example: false, description: 'Rack9 파트감지(RH)' })
  RH_Rack9_Part_On?: boolean;
  @ApiProperty({ example: false, description: 'Rack 종합이상(LH)' })
  LH_Rack_Total_Error?: boolean;
  @ApiProperty({ example: false, description: 'Rack 종합이상(RH)' })
  RH_Rack_Total_Error?: boolean;
  @ApiProperty({
    example: false,
    description: '화물입고상태(대기,입고,완료)',
  })
  Part_Status?: boolean;
  @ApiProperty({ example: 1, description: '자동창고 내 입고된 화물 종합 수량' })
  Count_Rack_Part_On?: number;
  @ApiProperty({ example: 1, description: '자동창고 ID(LH)' })
  LH_ASRS_ID?: string;
  @ApiProperty({ example: 1, description: '자동창고 ID(RH)' })
  RH_ASRS_ID?: string;
  @ApiProperty({ example: 1, description: 'Rack1 ID(LH)' })
  LH_Rack1_ID?: string;
  @ApiProperty({ example: 1, description: 'Rack2 ID(LH)' })
  LH_Rack2_ID?: string;
  @ApiProperty({ example: 1, description: 'Rack3 ID(LH)' })
  LH_Rack3_ID?: string;
  @ApiProperty({ example: 1, description: 'Rack4 ID(LH)' })
  LH_Rack4_ID?: string;
  @ApiProperty({ example: 1, description: 'Rack5 ID(LH)' })
  LH_Rack5_ID?: string;
  @ApiProperty({ example: 1, description: 'Rack6 ID(LH)' })
  LH_Rack6_ID?: string;
  @ApiProperty({ example: 1, description: 'Rack7 ID(LH)' })
  LH_Rack7_ID?: string;
  @ApiProperty({ example: 1, description: 'Rack8 ID(LH)' })
  LH_Rack8_ID?: string;
  @ApiProperty({ example: 1, description: 'Rack9 ID(LH)' })
  LH_Rack9_ID?: string;
  @ApiProperty({ example: 1, description: 'Rack1 ID(RH)' })
  RH_Rack1_ID?: string;
  @ApiProperty({ example: 1, description: 'Rack2 ID(RH)' })
  RH_Rack2_ID?: string;
  @ApiProperty({ example: 1, description: 'Rack3 ID(RH)' })
  RH_Rack3_ID?: string;
  @ApiProperty({ example: 1, description: 'Rack4 ID(RH)' })
  RH_Rack4_ID?: string;
  @ApiProperty({ example: 1, description: 'Rack5 ID(RH)' })
  RH_Rack5_ID?: string;
  @ApiProperty({ example: 1, description: 'Rack6 ID(RH)' })
  RH_Rack6_ID?: string;
  @ApiProperty({ example: 1, description: 'Rack7 ID(RH)' })
  RH_Rack7_ID?: string;
  @ApiProperty({ example: 1, description: 'Rack8 ID(RH)' })
  RH_Rack8_ID?: string;
  @ApiProperty({ example: 1, description: 'Rack9 ID(RH)' })
  RH_Rack9_ID?: string;
  @ApiProperty({
    example: { awbId: 1, count: 10 },
    description: 'LH Rack1 화물정보',
  })
  ASRS_LH_Rack1_Part_Info?: string | unknown;
  @ApiProperty({
    example: { awbId: 1, count: 10 },
    description: 'LH Rack2 화물정보',
  })
  ASRS_LH_Rack2_Part_Info?: string | unknown;
  @ApiProperty({
    example: { awbId: 1, count: 10 },
    description: 'LH Rack3 화물정보',
  })
  ASRS_LH_Rack3_Part_Info?: string | unknown;
  @ApiProperty({
    example: { awbId: 1, count: 10 },
    description: 'LH Rack4 화물정보',
  })
  ASRS_LH_Rack4_Part_Info?: string | unknown;
  @ApiProperty({
    example: { awbId: 1, count: 10 },
    description: 'LH Rack5 화물정보',
  })
  ASRS_LH_Rack5_Part_Info?: string | unknown;
  @ApiProperty({
    example: { awbId: 1, count: 10 },
    description: 'LH Rack6 화물정보',
  })
  ASRS_LH_Rack6_Part_Info?: string | unknown;
  @ApiProperty({
    example: { awbId: 1, count: 10 },
    description: 'LH Rack7 화물정보',
  })
  ASRS_LH_Rack7_Part_Info?: string | unknown;
  @ApiProperty({
    example: { awbId: 1, count: 10 },
    description: 'LH Rack8 화물정보',
  })
  ASRS_LH_Rack8_Part_Info?: string | unknown;
  @ApiProperty({
    example: { awbId: 1, count: 10 },
    description: 'LH Rack9 화물정보',
  })
  ASRS_LH_Rack9_Part_Info?: string | unknown;
  @ApiProperty({
    example: { awbId: 1, count: 10 },
    description: 'RH Rack1 화물정보',
  })
  ASRS_RH_Rack1_Part_Info?: string | unknown;
  @ApiProperty({
    example: { awbId: 1, count: 10 },
    description: 'RH Rack2 화물정보',
  })
  ASRS_RH_Rack2_Part_Info?: string | unknown;
  @ApiProperty({
    example: { awbId: 1, count: 10 },
    description: 'RH Rack3 화물정보',
  })
  ASRS_RH_Rack3_Part_Info?: string | unknown;
  @ApiProperty({
    example: { awbId: 1, count: 10 },
    description: 'RH Rack4 화물정보',
  })
  ASRS_RH_Rack4_Part_Info?: string | unknown;
  @ApiProperty({
    example: { awbId: 1, count: 10 },
    description: 'RH Rack5 화물정보',
  })
  ASRS_RH_Rack5_Part_Info?: string | unknown;
  @ApiProperty({
    example: { awbId: 1, count: 10 },
    description: 'RH Rack6 화물정보',
  })
  ASRS_RH_Rack6_Part_Info?: string | unknown;
  @ApiProperty({
    example: { awbId: 1, count: 10 },
    description: 'RH Rack7 화물정보',
  })
  ASRS_RH_Rack7_Part_Info?: string | unknown;
  @ApiProperty({
    example: { awbId: 1, count: 10 },
    description: 'RH Rack8 화물정보',
  })
  ASRS_RH_Rack8_Part_Info?: string | unknown;
  @ApiProperty({
    example: { awbId: 1, count: 10 },
    description: 'RH Rack9 화물정보',
  })
  ASRS_RH_Rack9_Part_Info?: string | unknown;
}
