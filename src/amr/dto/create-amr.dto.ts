import { ApiProperty, PickType } from '@nestjs/swagger';
import { Amr } from '../entities/amr.entity';
import { AmrChargeHistory } from '../../amr-charge-history/entities/amr-charge-history.entity';

export class CreateAmrDto extends PickType(Amr, [
  'name',
  'charging',
  'prcsCD',
  'ACSMode',
  'mode',
  'errorLevel',
  'errorCode',
  'startTime',
  'endTime',
  'travelDist',
  'oprTime',
  'stopTime',
  'startBatteryLevel',
  'lastBatteryLevel',
  'simulation',
  'logDT',
  'distinguish',
]) {
  // @ApiProperty({
  //   example: '충전기이름',
  //   description: '충전기이름',
  // })
  // public chargerName: string;
  //
  // @ApiProperty({
  //   example: '충전기이름',
  //   description: '충전기이름',
  // })
  // public working: boolean;
  //
  // @ApiProperty({ example: 1, description: 'x좌표' })
  // public x: string;
  // @ApiProperty({ example: 1, description: 'y좌표' })
  // public y: string;
  // @ApiProperty({ example: 1, description: 'z좌표' })
  // public z: string;
}
