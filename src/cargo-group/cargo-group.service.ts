import { Injectable } from '@nestjs/common';
import { CreateCargoGroupDto } from './dto/create-cargo-group.dto';
import { UpdateCargoGroupDto } from './dto/update-cargo-group.dto';

@Injectable()
export class CargoGroupService {
  create(createCargoGroupDto: CreateCargoGroupDto) {
    return 'This action adds a new cargoGroup';
  }

  findAll() {
    return `This action returns all cargoGroup`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cargoGroup`;
  }

  update(id: number, updateCargoGroupDto: UpdateCargoGroupDto) {
    return `This action updates a #${id} cargoGroup`;
  }

  remove(id: number) {
    return `This action removes a #${id} cargoGroup`;
  }
}
