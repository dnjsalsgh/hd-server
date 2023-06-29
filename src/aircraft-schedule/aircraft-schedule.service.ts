import { Injectable } from '@nestjs/common';
import { CreateAircraftScheduleDto } from './dto/create-aircraft-schedule.dto';
import { UpdateAircraftScheduleDto } from './dto/update-aircraft-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AircraftSchedule } from './entities/aircraft-schedule.entity';
import { Repository } from 'typeorm';
import { AircraftAttribute } from '../aircraft/entities/aircraft.entity';

@Injectable()
export class AircraftScheduleService {
  constructor(
    @InjectRepository(AircraftSchedule)
    private readonly aircraftScheduleRepository: Repository<AircraftSchedule>,
  ) {}

  create(createAircraftScheduleDto: CreateAircraftScheduleDto) {
    // createAircraftScheduleDto.code = new Date().getTime().toString();
    return this.aircraftScheduleRepository.save(createAircraftScheduleDto);
  }

  async findAll(source: string) {
    const queryBuilder = await this.aircraftScheduleRepository
      .createQueryBuilder('aircraftSchedule')
      .leftJoinAndSelect('aircraftSchedule.Aircraft', 'aircraft')
      .select(['aircraftSchedule', ...AircraftAttribute])
      .where('aircraftSchedule.source = :source', { source: source });

    const result = await queryBuilder.getMany();

    return result;
  }

  async findOne(id: number) {
    return await this.aircraftScheduleRepository.find({
      where: { id: id },
      relations: {
        Aircraft: true,
      },
    });
  }

  async update(
    id: number,
    updateAircraftScheduleDto: UpdateAircraftScheduleDto,
  ) {
    const { source, Aircraft, CcIdDestination } = updateAircraftScheduleDto;
    await this.aircraftScheduleRepository.update(id, {
      source,
      Aircraft,
      CcIdDestination,
    });
    return;
  }

  async remove(id: number) {
    return await this.aircraftScheduleRepository.delete(id);
  }
}
