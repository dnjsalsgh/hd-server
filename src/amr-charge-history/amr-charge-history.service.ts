import { Injectable } from '@nestjs/common';
import { CreateAmrChargeHistoryDto } from './dto/create-amr-charge-history.dto';
import { UpdateAmrChargeHistoryDto } from './dto/update-amr-charge-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Amr } from '../amr/entities/amr.entity';
import { Repository } from 'typeorm';
import { CreateAmrDto } from '../amr/dto/create-amr.dto';
import { UpdateAmrDto } from '../amr/dto/update-amr.dto';
import { AmrChargeHistory } from './entities/amr-charge-history.entity';

@Injectable()
export class AmrChargeHistoryService {
  constructor(
    @InjectRepository(AmrChargeHistory)
    private readonly amrChargeHistoryRepository: Repository<AmrChargeHistory>,
  ) {}
  create(createAmrChargeHistoryDto: CreateAmrChargeHistoryDto) {
    return this.amrChargeHistoryRepository.save(createAmrChargeHistoryDto);
  }

  findAll() {
    return this.amrChargeHistoryRepository.find();
  }

  findOne(id: number) {
    return this.amrChargeHistoryRepository.find({ where: { id: id } });
  }

  update(id: number, updateAmrChargeHistoryDto: UpdateAmrChargeHistoryDto) {
    return this.amrChargeHistoryRepository.update(
      id,
      updateAmrChargeHistoryDto,
    );
  }

  remove(id: number) {
    return this.amrChargeHistoryRepository.delete(id);
  }
}
