import { Injectable } from '@nestjs/common';
import { CreateStorageWorkOrderDto } from './dto/create-storage-work-order.dto';
import { UpdateStorageWorkOrderDto } from './dto/update-storage-work-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorageWorkOrder } from './entities/storage-work-order.entity';

@Injectable()
export class StorageWorkOrderService {
  constructor(
    @InjectRepository(StorageWorkOrder)
    private readonly storageWorkOrderRepository: Repository<StorageWorkOrder>,
  ) {}
  async create(
    createStorageWorkOrderDto: CreateStorageWorkOrderDto,
  ): Promise<StorageWorkOrder> {
    const storage = await this.storageWorkOrderRepository.create(
      createStorageWorkOrderDto,
    );

    await this.storageWorkOrderRepository.save(storage);
    return storage;
  }

  async findAll() {
    return await this.storageWorkOrderRepository.find();
  }

  async findOne(id: number) {
    const result = await this.storageWorkOrderRepository.findOne({
      where: { id: id },
    });
    return result;
  }

  update(id: number, updateStorageWorkOrderDto: UpdateStorageWorkOrderDto) {
    return this.storageWorkOrderRepository.update(
      id,
      updateStorageWorkOrderDto,
    );
  }

  remove(id: number) {
    return this.storageWorkOrderRepository.delete(id);
  }
}
