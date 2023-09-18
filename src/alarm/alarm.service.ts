import { Inject, Injectable } from '@nestjs/common';
import { CreateAlarmDto } from './dto/create-alarm.dto';
import { UpdateAlarmDto } from './dto/update-alarm.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Amr } from '../amr/entities/amr.entity';
import {
  Between,
  FindOperator,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Alarm } from './entities/alarm.entity';
import { UldType } from '../uld-type/entities/uld-type.entity';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { orderByUtil } from '../lib/util/orderBy.util';
import { ClientProxy } from '@nestjs/microservices';
import { take } from 'rxjs';

@Injectable()
export class AlarmService {
  constructor(
    @InjectRepository(Alarm)
    private readonly alarmRepository: Repository<Alarm>,
    @Inject('MQTT_SERVICE') private client: ClientProxy,
  ) {}
  async create(createAlarmDto: CreateAlarmDto) {
    const result = await this.alarmRepository.save(createAlarmDto);
    this.client.send(`hyundai/alarm/insert`, result).pipe(take(1)).subscribe();
    return result;
  }

  async findAll(query: Alarm & BasicQueryParamDto) {
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
    const findResult = await this.alarmRepository.find({
      where: {
        createdAt: findDate,
      },
      order: orderByUtil(query.order),
      take: query.limit,
      skip: query.offset,
    });

    this.client
      .send(`hyundai/alarm/find`, findResult)
      .pipe(take(1))
      .subscribe();

    return findResult;
  }

  async findOne(id: number) {
    const result = await this.alarmRepository.findOne({
      where: { id: id },
    });
    return result;
  }

  update(id: number, updateAlarmDto: UpdateAlarmDto) {
    return this.alarmRepository.update(id, updateAlarmDto);
  }

  remove(id: number) {
    return this.alarmRepository.delete(id);
  }
}
