import { PartialType } from '@nestjs/mapped-types';
import { CreateAwbDto } from './create-awb.dto';

export class UpdateAwbDto extends PartialType(CreateAwbDto) {}
