import { PartialType } from '@nestjs/mapped-types';
import { CreateSkidPlatformDto } from './create-skid-platform.dto';

export class UpdateSkidPlatformDto extends PartialType(CreateSkidPlatformDto) {}
