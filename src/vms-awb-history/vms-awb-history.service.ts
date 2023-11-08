import { Injectable } from '@nestjs/common';
import { CreateVmsAwbHistoryDto } from './dto/create-vms-awb-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VmsAwbHistory } from './entities/vms-awb-history.entity';

@Injectable()
export class VmsAwbHistoryService {
  constructor(
    @InjectRepository(VmsAwbHistory, 'dimoaDB')
    private readonly vmsAwbHistoryRepository: Repository<VmsAwbHistory>,
  ) {}

  create(createVmsAwbHistoryDto: CreateVmsAwbHistoryDto) {
    return this.vmsAwbHistoryRepository.save(createVmsAwbHistoryDto);
  }
}
