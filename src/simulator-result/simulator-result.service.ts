import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SimulatorResult } from './entities/simulator-result.entity';
import { Repository } from 'typeorm';
import { CreateSimulatorResultDto } from './dto/create-simulator-result.dto';
import { UpdateSimulatorResultDto } from './dto/update-simulator-result.dto';
import { UldAttribute } from '../uld/entities/uld.entity';
import { CreateSimulatorResultWithAwbDto } from './dto/create-simulator-result-with-awb';

@Injectable()
export class SimulatorResultService {
  constructor(
    @InjectRepository(SimulatorResult)
    private readonly simulatorResultRepository: Repository<SimulatorResult>,
  ) {}

  async create(createSimulatorResultDto: CreateSimulatorResultDto) {
    const result = await this.simulatorResultRepository.save(
      createSimulatorResultDto,
    );
    return result;
  }

  async createWithAwb(body: CreateSimulatorResultWithAwbDto) {
    const result = await this.simulatorResultRepository.save(body);
    return result;
  }

  async findAll() {
    return await this.simulatorResultRepository.find({
      relations: {
        Uld: true,
      },
      select: {
        Uld: UldAttribute,
      },
    });
  }

  async findOne(id: number) {
    return await this.simulatorResultRepository.find({ where: { id: id } });
  }

  update(id: number, updateSimulatorResultDto: UpdateSimulatorResultDto) {
    return this.simulatorResultRepository.update(id, updateSimulatorResultDto);
  }

  remove(id: number) {
    return this.simulatorResultRepository.delete(id);
  }
}
