import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUldDto } from './dto/create-uld.dto';
import { UpdateUldDto } from './dto/update-uld.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  Equal,
  FindOperator,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Uld } from './entities/uld.entity';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import {
  UldType,
  UldTypeAttribute,
} from '../uld-type/entities/uld-type.entity';
import { UldSccInjectionDto } from './dto/uld-sccInjection.dto';
import { UldSccJoin } from '../uld-scc-join/entities/uld-scc-join.entity';
import { SccAttribute } from '../scc/entities/scc.entity';
import { ClientProxy } from '@nestjs/microservices';
import { AircraftScheduleAttributes } from '../aircraft-schedule/entities/aircraft-schedule.entity';

@Injectable()
export class UldService {
  constructor(
    @InjectRepository(Uld)
    private readonly uldRepository: Repository<Uld>,
    @InjectRepository(UldType)
    private readonly UldTypeRepository: Repository<UldType>,
    @InjectRepository(UldSccJoin)
    private readonly uldSccJoinRepository: Repository<UldSccJoin>,
    @Inject('MQTT_SERVICE') private client: ClientProxy,
  ) {}

  async create(createUldDto: CreateUldDto) {
    // uldType 주입
    try {
      const uldTypeCode = createUldDto.UldType as unknown as string;
      const uldTypeResult = await this.UldTypeRepository.findOne({
        where: { code: uldTypeCode },
      });
      createUldDto.UldType = uldTypeResult.id;
    } catch (e) {
      throw new NotFoundException(`uldType not found`);
    }

    const createResult = await this.uldRepository.save(createUldDto);

    // uld 생성되면 mqtt로 전송
    this.client.send(`hyundai/uld/insert`, createResult).subscribe();

    return createResult;
  }

  async findAll(query: Uld & BasicQueryParamDto) {
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
    return await this.uldRepository.find({
      select: {
        UldType: UldTypeAttribute,
        AircraftSchedule: AircraftScheduleAttributes,
      },
      relations: {
        UldType: true,
        AircraftSchedule: true,
      },
      where: {
        // join 되는 테이블들의 FK를 typeorm 옵션에 맞추기위한 조정하기 위한 과정
        code: query.code ? ILike(`%${query.code}%`) : undefined,
        airplaneType: query.airplaneType,
        simulation: query.simulation,
        UldType: query.UldType ? Equal(+query.UldType) : undefined,
        AircraftSchedule: query.AircraftSchedule
          ? Equal(+query.AircraftSchedule)
          : undefined,
        createdAt: findDate,
      },
    });
  }

  async findOne(id: number) {
    const result = await this.uldRepository.findOne({
      where: { id: id },
      relations: {
        UldType: true,
        AircraftSchedule: true,
      },
      select: {
        UldType: UldTypeAttribute,
        AircraftSchedule: AircraftScheduleAttributes,
      },
    });
    return result;
  }

  complete() {
    this.client.send(`hyundai/work/complete`, { work: 'complete' }).subscribe();
  }

  update(id: number, updateUldDto: UpdateUldDto) {
    return this.uldRepository.update(id, updateUldDto);
  }

  remove(id: number) {
    return this.uldRepository.delete(id);
  }

  async injectionScc(id: number, body: UldSccInjectionDto) {
    const joinBody = body.Scc.map((item) => {
      return {
        Uld: id,
        Scc: item,
      };
    });
    const insertResult = await this.uldSccJoinRepository.save(joinBody);
  }
}
