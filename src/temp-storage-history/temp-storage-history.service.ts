import { Injectable } from '@nestjs/common';
import { CreateTempStorageHistoryDto } from './dto/create-temp-storage-history.dto';
import { UpdateTempStorageHistoryDto } from './dto/update-temp-storage-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TempStorageHistory } from './entities/temp-storage-history.entity';

@Injectable()
export class TempStorageHistoryService {
  constructor(
    @InjectRepository(TempStorageHistory)
    private readonly tempStorageHistoryRepository: Repository<TempStorageHistory>,
  ) {}
  async create(createTempStorageHistoryDto: CreateTempStorageHistoryDto) {
    const storage = await this.tempStorageHistoryRepository.create(
      createTempStorageHistoryDto,
    );

    await this.tempStorageHistoryRepository.save(storage);
    return storage;
  }

  async findAll() {
    return await this.tempStorageHistoryRepository.find();
  }

  async findOne(id: number) {
    const result = await this.tempStorageHistoryRepository.findOne({
      where: { id: id },
    });
    return result;
  }

  update(id: number, updateTempStorageHistoryDto: UpdateTempStorageHistoryDto) {
    return this.tempStorageHistoryRepository.update(
      id,
      updateTempStorageHistoryDto,
    );
  }

  remove(id: number) {
    return this.tempStorageHistoryRepository.delete(id);
  }
}
