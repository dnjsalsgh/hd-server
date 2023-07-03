import { Injectable } from '@nestjs/common';
import { CreateTempStorageDto } from './dto/create-temp-storage.dto';
import { UpdateTempStorageDto } from './dto/update-temp-storage.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TempStorage } from './entities/temp-storage.entity';

@Injectable()
export class TempStorageService {
  constructor(
    @InjectRepository(TempStorage)
    private readonly tempStorageRepository: Repository<TempStorage>,
  ) {}
  async create(createTempStorageDto: CreateTempStorageDto) {
    const storage = await this.tempStorageRepository.create(
      createTempStorageDto,
    );

    await this.tempStorageRepository.save(storage);
    return storage;
  }

  async findAll() {
    return await this.tempStorageRepository.find();
  }

  async findOne(id: number) {
    const result = await this.tempStorageRepository.findOne({
      where: { id: id },
    });
    return result;
  }

  update(id: number, updateTempStorageDto: UpdateTempStorageDto) {
    return this.tempStorageRepository.update(id, updateTempStorageDto);
  }

  remove(id: number) {
    return this.tempStorageRepository.delete(id);
  }
}
