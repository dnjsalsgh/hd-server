import { Injectable } from '@nestjs/common';
import { CreateSimulatorResultCargoJoinDto } from './dto/create-simulator-result-cargo-join.dto';
import { UpdateSimulatorResultCargoJoinDto } from './dto/update-simulator-result-cargo-join.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SimulatorResultAwbJoin } from './entities/simulator-result-awb-join.entity';

@Injectable()
export class SimulatorResultCargoJoinService {
  constructor(
    @InjectRepository(SimulatorResultAwbJoin)
    private readonly simulatorResultCargoJoinRepository: Repository<SimulatorResultAwbJoin>,
  ) {}

  async create(
    createSimulatorResultCargoJoinDto: CreateSimulatorResultCargoJoinDto,
  ) {
    const result = await this.simulatorResultCargoJoinRepository.save(
      createSimulatorResultCargoJoinDto,
    );
    return result;
  }

  async findAll() {
    return await this.simulatorResultCargoJoinRepository.find();
  }

  async findOne(id: number) {
    return await this.simulatorResultCargoJoinRepository.find({
      where: { id: id },
    });
  }

  update(
    id: number,
    updateSimulatorResultCargoJoinDto: UpdateSimulatorResultCargoJoinDto,
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
