import { Injectable } from '@nestjs/common';
import { CreateTimeTableDto } from './dto/create-time-table.dto';
import { UpdateTimeTableDto } from './dto/update-time-table.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeTable } from './entities/time-table.entity';
import { UldAttribute } from '../uld/entities/uld.entity';
import { AmrAttribute } from '../amr/entities/amr.entity';
import { AwbAttribute } from '../awb/entities/awb.entity';

@Injectable()
export class TimeTableService {
  constructor(
    @InjectRepository(TimeTable)
    private readonly timeTableRepository: Repository<TimeTable>,
  ) {}
  async create(createTimeTableDto: CreateTimeTableDto) {
    const asrs = await this.timeTableRepository.create(createTimeTableDto);

    await this.timeTableRepository.save(asrs);
    return asrs;
  }

  async findAll() {
    return await this.timeTableRepository.find({
      relations: {
        Uld: true,
        Amr: true,
        Awb: true,
      },
      select: {
        Uld: UldAttribute,
        Amr: AmrAttribute,
        Awb: AwbAttribute,
      },
    });
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
