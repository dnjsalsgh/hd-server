import { Inject, Injectable } from '@nestjs/common';
import { CreateAlarmDto } from './dto/create-alarm.dto';
import { UpdateAlarmDto } from './dto/update-alarm.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindOperator,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Alarm } from './entities/alarm.entity';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { orderByUtil } from '../lib/util/orderBy.util';
import { ClientProxy } from '@nestjs/microservices';
import { take } from 'rxjs';
import dayjs from 'dayjs';

@Injectable()
export class AlarmService {
  constructor(
    @InjectRepository(Alarm)
    private readonly alarmRepository: Repository<Alarm>,
    @Inject('MQTT_SERVICE') private client: ClientProxy,
  ) {}

  async create(createAlarmDto: CreateAlarmDto) {
    const result = await this.alarmRepository.save(createAlarmDto);
    this.client
      .send(`hyundai/alarm/insert`, result.id)
      .pipe(take(1))
      .subscribe();
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
        equipmentName: query.equipmentName,
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

  async changeAlarm(alarm: Alarm) {
    await this.alarmRepository.update(alarm.id, { count: alarm.count + 1 });
  }

  async getPreviousAlarmState(equipmentName: string) {
    // 오늘 날짜의 시작과 끝을 구하고, KST로 변환합니다 (UTC+9).
    const todayStart = dayjs().startOf('day').add(9, 'hour').toDate();
    const todayEnd = dayjs().endOf('day').add(9, 'hour').toDate();

    const [findResult] = await this.alarmRepository.find({
      where: {
        createdAt: Between(todayStart, todayEnd),
        equipmentName: equipmentName,
      },
      order: orderByUtil(null),
      take: 1,
    });
    return findResult;
  }
}
