import { SkidPlatformHistoryPlcDataDto } from './skid-platform-history-plc-data.dto';
import { CreateAsrsPlcDto } from '../../asrs/dto/create-asrs-plc.dto';
import { IntersectionType } from '@nestjs/swagger';

export class CreateSkidPlatformAndAsrsPlcDto extends IntersectionType(
  SkidPlatformHistoryPlcDataDto,
  CreateAsrsPlcDto,
) {}
