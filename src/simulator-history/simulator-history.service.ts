import { Injectable } from '@nestjs/common';
import { CreateSimulatorHistoryDto } from './dto/create-simulator-history.dto';
import { UpdateSimulatorHistoryDto } from './dto/update-simulator-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Scc } from '../scc/entities/scc.entity';
import { Repository } from 'typeorm';
import { CreateSccDto } from '../scc/dto/create-scc.dto';
import { UpdateSccDto } from '../scc/dto/update-scc.dto';
import { SimulatorHistory } from './entities/simulator-history.entity';

@Injectable()
export class SimulatorHistoryService {
  constructor(
    @InjectRepository(SimulatorHistory)
    private readonly simulatorHistoryRepository: Repository<SimulatorHistory>,
  ) {}

  async create(createSimulatorHistoryDto: CreateSimulatorHistoryDto) {
    const result = await this.simulatorHistoryRepository.save(
      createSimulatorHistoryDto,
    );
    return result;
  }

  async findAll() {
    return await this.simulatorHistoryRepository.find();
  }

  async findOne(id: number) {
    return await this.simulatorHistoryRepository.find({ where: { id: id } });
  }

  update(id: number, updateSimulatorHistoryDto: UpdateSimulatorHistoryDto) {
    return this.simulatorHistoryRepository.update(
      id,
      updateSimulatorHistoryDto,
    );
  }

  remove(id: number) {
    return this.simulatorHistoryRepository.delete(id);
  }
}
