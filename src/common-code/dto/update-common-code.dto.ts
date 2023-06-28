import { PartialType } from '@nestjs/swagger';
import { CreateCommonCodeDto } from './create-common-code.dto';

export class UpdateCommonCodeDto extends PartialType(CreateCommonCodeDto) {}
