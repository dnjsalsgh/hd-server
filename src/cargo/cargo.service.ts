import { Injectable } from '@nestjs/common';
import { CreateCargoDto } from './dto/create-cargo.dto';
import { UpdateCargoDto } from './dto/update-cargo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cargo } from './entities/cargo.entity';

@Injectable()
export class CargoService {
  constructor(
    @InjectRepository(Cargo)
    private readonly cargoRepository: Repository<Cargo>,
  ) {}
  create(createCargoDto: CreateCargoDto) {
    return this.cargoRepository.save(createCargoDto);
  }

  findAll() {
    return this.cargoRepository.find();
  }

  findOne(id: number) {
    return this.cargoRepository.find({ where: { id: id } });
  }

  update(id: number, updateCargoDto: UpdateCargoDto) {
    return this.cargoRepository.update(id, updateCargoDto);
  }

  remove(id: number) {
    return this.cargoRepository.delete(id);
  }
}
