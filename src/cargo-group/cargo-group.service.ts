import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CargoGroup } from './entities/cargo-group.entity';
import { CreateCargoGroupDto } from './dto/create-cargo-group.dto';
import { UpdateCargoGroupDto } from './dto/update-cargo-group.dto';

@Injectable()
export class CargoGroupService {
  constructor(
    @InjectRepository(CargoGroup)
    private readonly cargoGroupRepository: Repository<CargoGroup>,
  ) {}
  create(createCargoGroupDto: CreateCargoGroupDto) {
    return this.cargoGroupRepository.save(createCargoGroupDto);
  }

  findAll() {
    return this.cargoGroupRepository.find();
  }

  findOne(id: number) {
    return this.cargoGroupRepository.find({ where: { id: id } });
  }

  update(id: number, updateCargoGroupDto: UpdateCargoGroupDto) {
    return this.cargoGroupRepository.update(id, updateCargoGroupDto);
  }

  remove(id: number) {
    return this.cargoGroupRepository.delete(id);
  }
}
