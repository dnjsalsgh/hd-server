import { Injectable } from '@nestjs/common';
import { CreateCargoListDto } from './dto/create-cargo-list.dto';
import { UpdateCargoListDto } from './dto/update-cargo-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CargoList } from './entities/cargo-list.entity';

@Injectable()
export class CargoListService {
  constructor(
    @InjectRepository(CargoList)
    private readonly cargoListRepository: Repository<CargoList>,
  ) {}

  async create(createCargoListDto: CreateCargoListDto) {
    const result = await this.cargoListRepository.save(createCargoListDto);
    return result;
  }

  async findAll() {
    return await this.cargoListRepository.find();
  }

  async findOne(id: number) {
    return await this.cargoListRepository.find({ where: { id: id } });
  }

  update(id: number, updateCargoListDto: UpdateCargoListDto) {
    return this.cargoListRepository.update(id, updateCargoListDto);
  }

  remove(id: number) {
    return this.cargoListRepository.delete(id);
  }
}
