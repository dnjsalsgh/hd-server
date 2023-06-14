import { PartialType } from '@nestjs/mapped-types';
import { CreateStorageWorkOrderDto } from './create-storage-work-order.dto';

export class UpdateStorageWorkOrderDto extends PartialType(CreateStorageWorkOrderDto) {}
