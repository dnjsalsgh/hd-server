import { Injectable } from '@nestjs/common';
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
import { BasicQueryParam } from '../lib/dto/basicQueryParam';
import { UldTypeAttribute } from '../uld-type/entities/uld-type.entity';
import { UldSccInjectionDto } from './dto/uld-sccInjection.dto';
import { UldSccJoin } from '../uld-scc-join/entities/uld-scc-join.entity';
import { SccAttribute } from '../scc/entities/scc.entity';

@Injectable()
export class UldService {
  constructor(
    @InjectRepository(Uld)
    private readonly uldRepository: Repository<Uld>,
    @InjectRepository(UldSccJoin)
    private readonly uldSccJoinRepository: Repository<UldSccJoin>,
  ) {}
  async create(createUldDto: CreateUldDto) {
    const result = await this.uldRepository.create(createUldDto);

    await this.uldRepository.save(result);
    return result;
  }

  async findAll(query: Uld & BasicQueryParam) {
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
      },
      relations: {
        UldType: true,
      },
      where: {
        // join 되는 테이블들의 FK를 typeorm 옵션에 맞추기위한 조정하기 위한 과정
        code: query.code ? ILike(`%${query.code}%`) : undefined,
        airplaneType: query.airplaneType,
        simulation: query.simulation,
        UldType: query.UldType ? Equal(+query.UldType) : undefined,
        createdAt: findDate,
      },
    });
  }

  async findOne(id: number) {
    const result = await this.uldRepository.findOne({
      where: { id: id },
      relations: {
        UldType: true,
        Scc: true,
      },
      select: {
        UldType: UldTypeAttribute,
        Scc: SccAttribute,
      },
    });
    return result;
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
