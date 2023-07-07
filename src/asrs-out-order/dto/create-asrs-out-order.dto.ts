import { PickType } from '@nestjs/swagger';
import { AsrsOutOrder } from '../entities/asrs-out-order.entity';

export class CreateAsrsOutOrderDto extends PickType(AsrsOutOrder, [
  'order',
  'asrs',
  'skidPlatform',
  'awb',
]) {}
