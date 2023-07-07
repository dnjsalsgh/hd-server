import { PickType } from '@nestjs/swagger';
import { SkidPlatformHistory } from '../entities/skid-platform-history.entity';

export class CreateSkidPlatformHistoryDto extends PickType(
  SkidPlatformHistory,
  ['asrsOutOrder', 'asrs', 'skidPlatform', 'awb'],
) {}
