import { Injectable } from '@nestjs/common';
import { CreateSimulatorResultDto } from './dto/create-simulator-result.dto';
import { UpdateSimulatorResultDto } from './dto/update-simulator-result.dto';

@Injectable()
export class SimulatorResultService {
  create(createSimulatorResultDto: CreateSimulatorResultDto) {
    return 'This action adds a new simulatorResult';
  }

  findAll() {
    return `This action returns all simulatorResult`;
  }

  findOne(id: number) {
    return `This action returns a #${id} simulatorResult`;
  }

  update(id: number, updateSimulatorResultDto: UpdateSimulatorResultDto) {
    return `This action updates a #${id} simulatorResult`;
  }

  remove(id: number) {
    return `This action removes a #${id} simulatorResult`;
  }
}
