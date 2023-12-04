import { ApiProperty } from '@nestjs/swagger';

export class SkidPlatformHistoryPlcDataDto {
  @ApiProperty({ example: 'test2', description: '화물ID' })
  SUPPLY_01_01_P2A_Bill_No?: string;
  @ApiProperty({ example: 0, description: '화물 분리 번호' })
  SUPPLY_01_01_P2A_SEPARATION_NO?: string;
  @ApiProperty({ example: false, description: '일반 스키드 인식 센서' })
  SUPPLY_01_01_P2A_G_SKID_ON?: boolean;
  @ApiProperty({ example: false, description: '전용 스키드 인식 센서' })
  SUPPLY_01_01_P2A_D_SKID_ON?: boolean;

  @ApiProperty({ example: 'test2', description: '화물ID' })
  SUPPLY_01_02_P2A_Bill_No?: string;
  @ApiProperty({ example: 0, description: '화물 분리 번호' })
  SUPPLY_01_02_P2A_SEPARATION_NO?: string;
  @ApiProperty({ example: false, description: '일반 스키드 인식 센서' })
  SUPPLY_01_02_P2A_G_SKID_ON?: boolean;
  @ApiProperty({ example: false, description: '전용 스키드 인식 센서' })
  SUPPLY_01_02_P2A_D_SKID_ON?: boolean;

  @ApiProperty({ example: 'test2', description: '화물ID' })
  SUPPLY_01_03_P2A_Bill_No?: string;
  @ApiProperty({ example: 0, description: '화물 분리 번호' })
  SUPPLY_01_03_P2A_SEPARATION_NO?: string;
  @ApiProperty({ example: false, description: '일반 스키드 인식 센서' })
  SUPPLY_01_03_P2A_G_SKID_ON?: boolean;
  @ApiProperty({ example: false, description: '전용 스키드 인식 센서' })
  SUPPLY_01_03_P2A_D_SKID_ON?: boolean;

  @ApiProperty({ example: 'test2', description: '화물ID' })
  SUPPLY_01_04_P2A_Bill_No?: string;
  @ApiProperty({ example: 0, description: '화물 분리 번호' })
  SUPPLY_01_04_P2A_SEPARATION_NO?: string;
  @ApiProperty({ example: false, description: '일반 스키드 인식 센서' })
  SUPPLY_01_04_P2A_G_SKID_ON?: boolean;
  @ApiProperty({ example: false, description: '전용 스키드 인식 센서' })
  SUPPLY_01_04_P2A_D_SKID_ON?: boolean;
}
