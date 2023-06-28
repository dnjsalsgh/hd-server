import { Injectable } from '@nestjs/common';
import { CreateAircraftScheduleDto } from './dto/create-aircraft-schedule.dto';
import { UpdateAircraftScheduleDto } from './dto/update-aircraft-schedule.dto';

@Injectable()
export class AircraftScheduleService {
  create(createAircraftScheduleDto: CreateAircraftScheduleDto) {
    return 'This action adds a new aircraftSchedule';
  }

  findAll() {
    return `This action returns all aircraftSchedule`;
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
