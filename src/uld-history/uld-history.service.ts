import { Injectable } from '@nestjs/common';
import { CreateUldHistoryDto } from './dto/create-uld-history.dto';
import { UpdateUldHistoryDto } from './dto/update-uld-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UldHistory } from './entities/uld-history.entity';

@Injectable()
export class UldHistoryService {
  constructor(
    @InjectRepository(UldHistory)
    private readonly uldHistoryRepository: Repository<UldHistory>,
  ) {}
  async create(createUldHistoryDto: CreateUldHistoryDto) {
    const result = await this.uldHistoryRepository.create(createUldHistoryDto);

    await this.uldHistoryRepository.save(result);
    return result;
  }

  async findAll() {
    return await this.uldHistoryRepository.find();
  }

  async findOne(id: number) {
    const result = await this.uldHistoryRepository.findOne({
      where: { id: id },
    });
    return result;
  }

  update(id: number, updateUldHistoryDto: UpdateUldHistoryDto) {
    return this.uldHistoryRepository.update(id, updateUldHistoryDto);
  }

  remove(id: number) {
    return this.uldHistoryRepository.delete(id);
  }
}
