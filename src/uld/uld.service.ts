import { Injectable } from '@nestjs/common';
import { CreateUldDto } from './dto/create-uld.dto';
import { UpdateUldDto } from './dto/update-uld.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeTable } from '../time-table/entities/time-table.entity';
import { Repository } from 'typeorm';
import { CreateTimeTableDto } from '../time-table/dto/create-time-table.dto';
import { UpdateTimeTableDto } from '../time-table/dto/update-time-table.dto';
import { Uld } from './entities/uld.entity';

@Injectable()
export class UldService {
  constructor(
    @InjectRepository(Uld)
    private readonly uldRepository: Repository<Uld>,
  ) {}
  async create(createUldDto: CreateUldDto) {
    const result = await this.uldRepository.create(createUldDto);

    await this.uldRepository.save(result);
    return result;
  }

  async findAll() {
    return await this.uldRepository.find();
  }

  async findOne(id: number) {
    const result = await this.uldRepository.findOne({
      where: { id: id },
    });
    return result;
  }

  update(id: number, updateUldDto: UpdateUldDto) {
    return this.uldRepository.update(id, updateUldDto);
  }

  remove(id: number) {
    return this.uldRepository.delete(id);
  }
}
