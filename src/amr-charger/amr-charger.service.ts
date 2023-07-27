import { Injectable } from '@nestjs/common';
import { CreateAmrChargerDto } from './dto/create-amr-charger.dto';
import { UpdateAmrChargerDto } from './dto/update-amr-charger.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Amr } from '../amr/entities/amr.entity';
import {
  Between,
  FindOperator,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { AmrCharger } from './entities/amr-charger.entity';
import { QueryParam } from '../lib/dto/query.param';
import { getOrderBy } from '../lib/util/getOrderBy';

@Injectable()
export class AmrChargerService {
  constructor(
    @InjectRepository(AmrCharger)
    private readonly amrChargerRepository: Repository<AmrCharger>,
  ) {}
  create(createAmrChargerDto: CreateAmrChargerDto) {
    return this.amrChargerRepository.save(createAmrChargerDto);
  }

  findAll(query: AmrCharger & QueryParam) {
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
    return this.amrChargerRepository.find({
      where: {
        name: query.name,
        working: query.working,
        x: query.x,
        y: query.y,
        z: query.z,
        createdAt: findDate,
      },
      order: getOrderBy(query.order),
      take: query.limit,
      skip: query.offset,
    });
  }

  findOne(id: number) {
    return this.amrChargerRepository.find({ where: { id: id } });
  }

  update(id: number, updateAmrChargerDto: UpdateAmrChargerDto) {
    return this.amrChargerRepository.update(id, updateAmrChargerDto);
  }

  remove(id: number) {
    return this.amrChargerRepository.delete(id);
  }
}
