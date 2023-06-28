import { Injectable } from '@nestjs/common';
import { CreateAircraftScheduleDto } from './dto/create-aircraft-schedule.dto';
import { UpdateAircraftScheduleDto } from './dto/update-aircraft-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AircraftSchedule } from './entities/aircraft-schedule.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AircraftScheduleService {
  constructor(
    @InjectRepository(AircraftSchedule)
    private readonly aircraftScheduleRepository: Repository<AircraftSchedule>,
  ) {}
  create(createAircraftScheduleDto: CreateAircraftScheduleDto) {
    createAircraftScheduleDto.code = new Date().getTime().toString();
    return this.aircraftScheduleRepository.save(createAircraftScheduleDto);
  }

  findAll() {
    console.log('서비스 들어옴');
    const result = this.aircraftScheduleRepository.find({
      relations: ['aircraftId'],
    });
    return result;
  }

  findOne(id: number) {
    return `This action returns a #${id} aircraftSchedule`;
  }

  update(id: number, updateAircraftScheduleDto: UpdateAircraftScheduleDto) {
    return `This action updates a #${id} aircraftSchedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} aircraftSchedule`;
  }
}
