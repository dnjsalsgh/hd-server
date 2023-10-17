import { PartialType } from '@nestjs/swagger';
import { CreateBasicDto } from './create-basic.dto';

export class UpdateBasicDto extends PartialType(CreateBasicDto) {}
