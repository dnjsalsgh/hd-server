import { PickType } from '@nestjs/swagger';
import { Basic } from '../entities/basic.entity';

export class CreateBasicDto extends PickType(Basic, ['name']) {}
