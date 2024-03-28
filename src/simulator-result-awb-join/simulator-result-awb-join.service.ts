import { Injectable } from '@nestjs/common';
import { CreateSimulatorResultAwbJoinDto } from './dto/create-simulator-result-awb-join.dto';
import { UpdateSimulatorResultAwbJoinDto } from './dto/update-simulator-result-awb-join.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SimulatorResultAwbJoin } from './entities/simulator-result-awb-join.entity';

@Injectable()
export class SimulatorResultAwbJoinService {
  constructor(
    @InjectRepository(SimulatorResultAwbJoin)
    private readonly simulatorResultCargoJoinRepository: Repository<SimulatorResultAwbJoin>,
  ) {}

  async create(
    createSimulatorResultCargoJoinDto: CreateSimulatorResultAwbJoinDto,
  ) {
    const result = await this.simulatorResultCargoJoinRepository.save(
      createSimulatorResultCargoJoinDto,
    );
    return result;
  }

  async findAll() {
    return await this.simulatorResultCargoJoinRepository.find();
  }

  async findOne(id: number) {}

  update(
    id: number,
    updateSimulatorResultCargoJoinDto: UpdateSimulatorResultAwbJoinDto,
  ) {
    return this.simulatorResultCargoJoinRepository.update(
      id,
      updateSimulatorResultCargoJoinDto,
    );
  }

  remove(id: number) {
    return this.simulatorResultCargoJoinRepository.delete(id);
  }
}
