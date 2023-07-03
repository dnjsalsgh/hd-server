import { Injectable } from '@nestjs/common';
import { CreateTimeTableDto } from './dto/create-time-table.dto';
import { UpdateTimeTableDto } from './dto/update-time-table.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeTable } from './entities/time-table.entity';

@Injectable()
export class TimeTableService {
  constructor(
    @InjectRepository(TimeTable)
    private readonly timeTableRepository: Repository<TimeTable>,
  ) {}
  async create(createTimeTableDto: CreateTimeTableDto) {
    const storage = await this.timeTableRepository.create(createTimeTableDto);

    await this.timeTableRepository.save(storage);
    return storage;
  }

  async findAll() {
    return await this.timeTableRepository.find();
  }

  async findOne(id: number) {
    const result = await this.timeTableRepository.findOne({
      where: { id: id },
    });
    return result;
  }

  update(id: number, updateTimeTableDto: UpdateTimeTableDto) {
    return this.timeTableRepository.update(id, updateTimeTableDto);
  }

  remove(id: number) {
    return this.timeTableRepository.delete(id);
  }
}
