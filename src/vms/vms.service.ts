import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vms } from './entities/vms.entity';
import {
  Between,
  FindOperator,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { CreateVmsDto } from './dto/create-vms.dto';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { orderByUtil } from '../lib/util/orderBy.util';

@Injectable()
export class VmsService {
  constructor(
    @InjectRepository(Vms) private readonly vmsRepository: Repository<Vms>,
  ) {}

  create(createVmsDto: CreateVmsDto) {
    return this.vmsRepository.save(createVmsDto);
  }

  async findAll(query: Vms & BasicQueryParamDto) {
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

    console.log(await this.vmsRepository.find({}));
    return await this.vmsRepository.find({
      where: {
        name: query.name ? ILike(`%${query.name}%`) : undefined,
        createdAt: findDate,
      },
      order: orderByUtil(query.order),
      take: query.limit,
      skip: query.offset,
    });
  }

  async findOne(id: number) {
    const result = await this.vmsRepository.findOne({
      where: { id: id },
    });
    return result;
  }
}
