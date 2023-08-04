import { PartialType } from '@nestjs/mapped-types';
import { CreateSkidPlatformHistoryDto } from './create-skid-platform-history.dto';

export class UpdateSkidPlatformHistoryDto extends PartialType(
  CreateSkidPlatformHistoryDto,
) {}
