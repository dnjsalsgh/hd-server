import { Injectable } from '@nestjs/common';
import { CreateStorageWorkOrderDto } from './dto/create-storage-work-order.dto';
import { UpdateStorageWorkOrderDto } from './dto/update-storage-work-order.dto';

@Injectable()
export class StorageWorkOrderService {
  create(createStorageWorkOrderDto: CreateStorageWorkOrderDto) {
    return 'This action adds a new storageWorkOrder';
  }

  findAll() {
    return `This action returns all storageWorkOrder`;
  }

  findOne(id: number) {
    return `This action returns a #${id} storageWorkOrder`;
  }

  update(id: number, updateStorageWorkOrderDto: UpdateStorageWorkOrderDto) {
    return `This action updates a #${id} storageWorkOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} storageWorkOrder`;
  }
}
