import { Injectable } from '@nestjs/common';
import { CreateCargoSccJoinDto } from './dto/create-cargo-scc-join.dto';
import { UpdateCargoSccJoinDto } from './dto/update-cargo-scc-join.dto';

@Injectable()
export class CargoSccJoinService {
  create(createCargoSccJoinDto: CreateCargoSccJoinDto) {
    return 'This action adds a new cargoSccJoin';
  }

  findAll() {
    return `This action returns all cargoSccJoin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cargoSccJoin`;
  }

  update(id: number, updateCargoSccJoinDto: UpdateCargoSccJoinDto) {
    return `This action updates a #${id} cargoSccJoin`;
  }

  remove(id: number) {
    return `This action removes a #${id} cargoSccJoin`;
  }
}
