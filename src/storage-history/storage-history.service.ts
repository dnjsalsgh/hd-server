import { Injectable } from '@nestjs/common';
import { CreateStorageHistoryDto } from './dto/create-storage-history.dto';
import { UpdateStorageHistoryDto } from './dto/update-storage-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Storage } from '../storage/entities/storage.entity';
import { Repository } from 'typeorm';
import { CreateStorageDto } from '../storage/dto/create-storage.dto';
import { UpdateStorageDto } from '../storage/dto/update-storage.dto';
import { StorageHistory } from './entities/storage-history.entity';

@Injectable()
export class StorageHistoryService {
  constructor(
    @InjectRepository(StorageHistory)
    private readonly storageHistoryRepository: Repository<StorageHistory>,
  ) {}
  async create(
    createStorageHistoryDto: CreateStorageHistoryDto,
  ): Promise<StorageHistory> {
    const storage = await this.storageHistoryRepository.create(
      createStorageHistoryDto,
    );

    await this.storageHistoryRepository.save(storage);
    return storage;
  }

  async findAll() {
    return await this.storageHistoryRepository.find();
  }

  async findOne(id: number) {
    const result = await this.storageHistoryRepository.findOne({
      where: { id: id },
    });
    return result;
  }

  update(id: number, updateStorageHistoryDto: UpdateStorageHistoryDto) {
    return this.storageHistoryRepository.update(id, updateStorageHistoryDto);
  }

  remove(id: number) {
    return this.storageHistoryRepository.delete(id);
  }
}
