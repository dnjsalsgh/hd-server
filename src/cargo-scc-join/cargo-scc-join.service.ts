import { Injectable } from '@nestjs/common';
import { CreateCargoSccJoinDto } from './dto/create-cargo-scc-join.dto';
import { UpdateCargoSccJoinDto } from './dto/update-cargo-scc-join.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CargoSccJoin } from './entities/cargo-scc-join.entity';

@Injectable()
export class CargoSccJoinService {
  constructor(
    @InjectRepository(CargoSccJoin)
    private readonly cargoGroupRepository: Repository<CargoSccJoin>,
  ) {}
  create(createCargoSccJoinDto: CreateCargoSccJoinDto) {
    return this.cargoGroupRepository.save(createCargoSccJoinDto);
  }

  findAll() {
    return this.cargoGroupRepository.find();
  }

  findOne(id: number) {
    return this.cargoGroupRepository.find({ where: { id: id } });
  }

  update(id: number, updateCargoSccJoinDto: UpdateCargoSccJoinDto) {
    return this.cargoGroupRepository.update(id, updateCargoSccJoinDto);
  }

  remove(id: number) {
    return this.cargoGroupRepository.delete(id);
  }
}
