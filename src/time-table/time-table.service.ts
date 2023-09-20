import { Injectable } from '@nestjs/common';
import { CreateTimeTableDto } from './dto/create-time-table.dto';
import { UpdateTimeTableDto } from './dto/update-time-table.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  Equal,
  FindOperator,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { TimeTable } from './entities/time-table.entity';
import { UldAttribute } from '../uld/entities/uld.entity';
import { AmrAttribute } from '../amr/entities/amr.entity';
import { AwbAttribute } from '../awb/entities/awb.entity';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { AircraftScheduleAttributes } from '../aircraft-schedule/entities/aircraft-schedule.entity';

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

  async findAll(query: TimeTable & BasicQueryParamDto) {
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
    return await this.timeTableRepository.find({
      relations: {
        Uld: true,
        Amr: true,
        Awb: true,
        AircraftSchedule: true,
      },
      select: {
        Uld: UldAttribute,
        Amr: AmrAttribute,
        Awb: AwbAttribute,
        AircraftSchedule: AircraftScheduleAttributes,
      },
      where: {
        // join 되는 테이블들의 FK를 typeorm 옵션에 맞추기위한 조정하기 위한 과정
        Uld: query.Uld ? Equal(+query.Uld) : undefined,
        Amr: query.Amr ? Equal(+query.Amr) : undefined,
        Awb: query.Awb ? Equal(+query.Awb) : undefined,
        AircraftSchedule: query.AircraftSchedule
          ? Equal(+query.AircraftSchedule)
          : undefined,
        createdAt: findDate,
      },
    });
  }

  async findOne(id: number) {
    const result = await this.timeTableRepository.findOne({
      where: { id: id },
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
    return result;
  }

  update(id: number, updateTimeTableDto: UpdateTimeTableDto) {
    return this.timeTableRepository.update(id, updateTimeTableDto);
  }

  remove(id: number) {
    return this.timeTableRepository.delete(id);
  }
}
