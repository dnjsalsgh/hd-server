import { PickType } from '@nestjs/swagger';
import { BuildUpOrder } from '../entities/build-up-order.entity';

export class CreateBuildUpOrderDto extends PickType(BuildUpOrder, [
  'order',
  'x',
  'y',
  'z',
  'SkidPlatform',
  'Uld',
  'Awb',
]) {}
