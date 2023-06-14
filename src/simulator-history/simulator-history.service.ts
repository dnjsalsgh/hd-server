import { Injectable } from '@nestjs/common';
import { CreateSimulatorHistoryDto } from './dto/create-simulator-history.dto';
import { UpdateSimulatorHistoryDto } from './dto/update-simulator-history.dto';

@Injectable()
export class SimulatorHistoryService {
  create(createSimulatorHistoryDto: CreateSimulatorHistoryDto) {
    return 'This action adds a new simulatorHistory';
  }

  findAll() {
    return `This action returns all simulatorHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} simulatorHistory`;
  }

  update(id: number, updateSimulatorHistoryDto: UpdateSimulatorHistoryDto) {
    return `This action updates a #${id} simulatorHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} simulatorHistory`;
  }
}
