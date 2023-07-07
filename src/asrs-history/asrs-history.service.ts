import { Injectable } from '@nestjs/common';
import { CreateAsrsHistoryDto } from './dto/create-asrs-history.dto';
import { UpdateAsrsHistoryDto } from './dto/update-asrs-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Asrs } from '../asrs/entities/asrs.entity';
import { Repository } from 'typeorm';
import { CreateAsrsDto } from '../asrs/dto/create-asrs.dto';
import { UpdateAsrsDto } from '../asrs/dto/update-asrs.dto';
import { AsrsHistory } from './entities/asrs-history.entity';

@Injectable()
export class AsrsHistoryService {
  constructor(
    @InjectRepository(AsrsHistory)
    private readonly asrsHistoryRepository: Repository<AsrsHistory>,
  ) {}
  async create(
    createAsrsHistoryDto: CreateAsrsHistoryDto,
  ): Promise<AsrsHistory> {
    const asrs = await this.asrsHistoryRepository.create(createAsrsHistoryDto);

    await this.asrsHistoryRepository.save(asrs);
    return asrs;
  }

  async findAll() {
    return await this.asrsHistoryRepository.find();
  }

  async findOne(id: number) {
    const result = await this.asrsHistoryRepository.findOne({
      where: { id: id },
    });
    return result;
  }

  update(id: number, updateAsrsHistoryDto: UpdateAsrsHistoryDto) {
    return this.asrsHistoryRepository.update(id, updateAsrsHistoryDto);
  }

  remove(id: number) {
    return this.asrsHistoryRepository.delete(id);
  }
}
