import { Injectable } from '@nestjs/common';
import { CreateSimulatorResultCargoJoinDto } from './dto/create-simulator-result-cargo-join.dto';
import { UpdateSimulatorResultCargoJoinDto } from './dto/update-simulator-result-cargo-join.dto';

@Injectable()
export class SimulatorResultCargoJoinService {
  create(createSimulatorResultCargoJoinDto: CreateSimulatorResultCargoJoinDto) {
    return 'This action adds a new simulatorResultCargoJoin';
  }

  findAll() {
    return `This action returns all simulatorResultCargoJoin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} simulatorResultCargoJoin`;
  }

  update(id: number, updateSimulatorResultCargoJoinDto: UpdateSimulatorResultCargoJoinDto) {
    return `This action updates a #${id} simulatorResultCargoJoin`;
  }

  remove(id: number) {
    return `This action removes a #${id} simulatorResultCargoJoin`;
  }
}
