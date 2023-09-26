import { Injectable } from '@nestjs/common';
import { CreateAircraftDto } from './dto/create-aircraft.dto';
import { UpdateAircraftDto } from './dto/update-aircraft.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Aircraft } from './entities/aircraft.entity';
import { Repository } from 'typeorm';
import { Asrs } from '../asrs/entities/asrs.entity';

@Injectable()
export class AircraftService {
  constructor(
    @InjectRepository(Aircraft)
    private readonly aircraftRepository: Repository<Aircraft>,
  ) {}
  async create(createAircraftDto: CreateAircraftDto) {
    const result = await this.aircraftRepository.save(createAircraftDto);
    return result;
  }

  async findAll() {
    const result = await this.aircraftRepository.find();
    return result;
  }

  async findOne(id: number) {
    const result = await this.aircraftRepository.findOne({ where: { id: id } });
    return result;
  }

  update(id: number, updateAircraftDto: UpdateAircraftDto) {
    return `This action updates a #${id} aircraft`;
  }

  remove(id: number) {
    return `This action removes a #${id} aircraft`;
  }
}
