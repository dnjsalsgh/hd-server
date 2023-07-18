import { ApiProperty } from '@nestjs/swagger';

export class SkidPlatformHistoryPlcDataDto {
  @ApiProperty({ example: false, description: '안착대1 파트감지' })
  Pallet_Rack1_Part_On?: boolean;
  @ApiProperty({ example: false, description: '안착대2 파트감지' })
  Pallet_Rack2_Part_On?: boolean;
  @ApiProperty({ example: false, description: '안착대3 파트감지' })
  Pallet_Rack3_Part_On?: boolean;
  @ApiProperty({ example: false, description: '안착대4 파트감지' })
  Pallet_Rack4_Part_On?: boolean;
  @ApiProperty({ example: { awbId: 1 }, description: '안착대1 화물정보' })
  Pallet_Rack1_Part_Info?: string;
  @ApiProperty({ example: { awbId: 1 }, description: '안착대2 화물정보' })
  Pallet_Rack2_Part_Info?: string;
  @ApiProperty({ example: { awbId: 1 }, description: '안착대3 화물정보' })
  Pallet_Rack3_Part_Info?: string;
  @ApiProperty({ example: { awbId: 1 }, description: '안착대4 화물정보' })
  Pallet_Rack4_Part_Info?: string;
}
