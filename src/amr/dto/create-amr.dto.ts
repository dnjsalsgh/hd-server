import { PickType } from '@nestjs/swagger';
import { Amr } from '../entities/amr.entity';

export class CreateAmrDto extends PickType(Amr, [
  'name',
  'charging',
  'mode',
  'errorCode',
  'soc',
  'travelDist',
  'oprTime',
  'stopTime',
  'startBatteryLevel',
  'simulation',
  'logDT',
]) {}
