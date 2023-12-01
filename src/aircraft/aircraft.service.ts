import { Injectable } from '@nestjs/common';
import { CreateAircraftDto } from './dto/create-aircraft.dto';
import { UpdateAircraftDto } from './dto/update-aircraft.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Aircraft } from './entities/aircraft.entity';
import {
  Between,
  FindOperator,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { AircraftScheduleAttributes } from '../aircraft-schedule/entities/aircraft-schedule.entity';

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

  async findAll(query: Aircraft & BasicQueryParamDto) {
    // createdAt 기간검색 처리
    const { createdAtFrom, createdAtTo } = query;
    let findDate: FindOperator<Date>;
    if (createdAtFrom && createdAtTo) {
      findDate = Between(createdAtFrom, createdAtTo);
    } else if (createdAtFrom) {
      findDate = MoreThanOrEqual(createdAtFrom);
    } else if (createdAtTo) {
      findDate = LessThanOrEqual(createdAtTo);
    }
    const result = await this.aircraftRepository.find({
      select: {
        // AircraftSchedules: AircraftScheduleAttributes,
      },
      relations: {
        // AircraftSchedules: true,
      },
      where: {
        name: query.name ? ILike(`%${query.name}%`) : undefined,
        code: query.code ? ILike(`%${query.code}%`) : undefined,
        createdAt: findDate,
      },
    });
    return result;
  }

  async findOne(id: number) {
    const result = await this.aircraftRepository.findOne({ where: { id: id } });
    return result;
  }

  update(id: number, updateAircraftDto: UpdateAircraftDto) {
    return this.aircraftRepository.update(id, updateAircraftDto);
  }

  remove(id: number) {
    return this.aircraftRepository.delete(id);
  }
}
