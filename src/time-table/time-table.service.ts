import { Injectable } from '@nestjs/common';
import { CreateTimeTableDto } from './dto/create-time-table.dto';
import { UpdateTimeTableDto } from './dto/update-time-table.dto';

@Injectable()
export class TimeTableService {
  create(createTimeTableDto: CreateTimeTableDto) {
    return 'This action adds a new timeTable';
  }

  findAll() {
    return `This action returns all timeTable`;
  }

  findOne(id: number) {
    return `This action returns a #${id} timeTable`;
  }

  update(id: number, updateTimeTableDto: UpdateTimeTableDto) {
    return `This action updates a #${id} timeTable`;
  }

  remove(id: number) {
    return `This action removes a #${id} timeTable`;
  }
}
