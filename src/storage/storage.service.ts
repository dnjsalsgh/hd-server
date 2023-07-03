import { Injectable } from '@nestjs/common';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Storage } from './entities/storage.entity';
import { Repository } from 'typeorm';
import { ResponseDto } from '../lib/dto/response.dto';

@Injectable()
export class StorageService {
  constructor(
    @InjectRepository(Storage)
    private readonly storageRepository: Repository<Storage>,
  ) {}
  async create(createStorageDto: CreateStorageDto): Promise<Storage> {
    const storage = await this.storageRepository.create(createStorageDto);

    await this.storageRepository.save(storage);
    return storage;
  }

  async findAll() {
    return await this.storageRepository.find();
  }

  async findOne(id: number) {
    const result = await this.storageRepository.findOne({ where: { id: id } });
    return result;
  }

  update(id: number, updateStorageDto: UpdateStorageDto) {
    return this.storageRepository.update(id, updateStorageDto);
  }

  remove(id: number) {
    return this.storageRepository.delete(id);
  }
}
