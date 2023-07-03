import { PickType } from '@nestjs/swagger';
import { Amr } from '../entities/amr.entity';

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
]) {}
