import { PickType } from '@nestjs/swagger';
import { InspectWorkOrder } from '../entities/inspect-work-order.entity';

export class CreateInspectWorkOrderDto extends PickType(InspectWorkOrder, [
  'order',
  'x',
  'y',
  'z',
]) {}
