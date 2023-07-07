import { PickType } from '@nestjs/swagger';
import { AwbGroup } from '../entities/awb-group.entity';

export class CreateAwbGroupDto extends PickType(AwbGroup, ['name', 'code']) {}
