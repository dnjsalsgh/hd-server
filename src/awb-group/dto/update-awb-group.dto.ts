import { PartialType } from '@nestjs/swagger';
import { CreateAwbGroupDto } from './create-awb-group.dto';

export class UpdateAwbGroupDto extends PartialType(CreateAwbGroupDto) {}
