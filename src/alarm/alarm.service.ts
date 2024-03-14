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
import { adjustDate } from '../lib/util/adjustDate';

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

    // 날짜 조정 로직 적용
    const updatedFindResult = findResult.map((item) => {
      if (item.createdAt instanceof Date && item.updatedAt instanceof Date) {
        return {
          ...item,
          createdAt: adjustDate(item.createdAt, 9), // createdAt에 +9시간
          updatedAt: adjustDate(item.updatedAt, 9), // updatedAt에 +9시간
        };
      }
      return item;
    });

    this.client
      .send(`hyundai/alarm/find`, updatedFindResult)
      .pipe(take(1))
      .subscribe();

    return updatedFindResult;
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

  removeAll() {
    return this.alarmRepository.delete({});
  }

  async changeAlarm(alarm: Alarm, check: boolean) {
    if (check) {
      await this.alarmRepository.update(alarm.id, {
        count: alarm.count + 1,
      });
    }
  }

  async changeAlarmByAlarmId(alarmId: number, count: number, check: boolean) {
    if (check) {
      const todayStart = dayjs().startOf('day').toDate();
      const todayEnd = dayjs().endOf('day').toDate();

      await this.alarmRepository.update(
        { id: alarmId, createdAt: Between(todayStart, todayEnd) },
        {
          count: count + 1,
        },
      );
    }
  }

  async makeAlarm(equipmentName: string, alarmMessage: string) {
    await this.create({
      equipmentName: equipmentName,
      stopTime: new Date(),
      count: 1,
      alarmMessage: alarmMessage,
      done: false,
    });
  }

  async changeAlarmIsDone(alarm: Alarm, done: boolean) {
    await this.alarmRepository.update(alarm.id, {
      done: done,
    });
  }

  async getPreviousAlarmState(equipmentName: string, alarmMessage: string) {
    // 오늘 날짜의 시작과 끝을 구하고, KST로 변환합니다 (UTC+9).
    const todayStart = dayjs().startOf('day').toDate();
    const todayEnd = dayjs().endOf('day').toDate();

    const [findResult] = await this.alarmRepository.find({
      where: {
        createdAt: Between(todayStart, todayEnd),
        equipmentName: equipmentName,
        alarmMessage: alarmMessage,
      },
      order: orderByUtil(null),
      take: 1,
    });
    return findResult;
  }

  async test() {
    const todayStart = dayjs().startOf('day').toDate();
    const todayEnd = dayjs().endOf('day').toDate();
    // const todayStart = dayjs().startOf('day').add(9, 'hour').toDate();
    // const todayEnd = dayjs().endOf('day').add(9, 'hour').toDate();
    console.log('todayStart = ', todayStart);
    console.log('todayEnd = ', todayEnd);

    const [findResult] = await this.alarmRepository.find({
      where: {
        createdAt: Between(todayStart, todayEnd),
      },
      order: orderByUtil(null),
      take: 1,
    });
    console.log('findResult = ', findResult);
    return findResult;
  }
}
