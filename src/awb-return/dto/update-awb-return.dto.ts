import { PartialType } from '@nestjs/swagger';
import { CreateAwbReturnDto } from './create-awb-return.dto';

export class UpdateAwbReturnDto extends PartialType(CreateAwbReturnDto) {}
