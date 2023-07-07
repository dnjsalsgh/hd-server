import { PartialType } from '@nestjs/mapped-types';
import { CreateAwbSccJoinDto } from './create-awb-scc-join.dto';

export class UpdateAwbSccJoinDto extends PartialType(CreateAwbSccJoinDto) {}
