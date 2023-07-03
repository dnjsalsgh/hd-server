import { StorageWorkOrder } from '../entities/storage-work-order.entity';
import { PickType } from '@nestjs/swagger';

export class CreateStorageWorkOrderDto extends PickType(StorageWorkOrder, [
  'order',
  'storage',
  'tempStorage',
  'cargo',
]) {}
