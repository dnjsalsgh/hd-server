import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindOperator,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { orderByUtil } from '../lib/util/orderBy.util';
import { Vms2d } from './entities/vms2d.entity';
import { CreateVms2dDto } from './dto/create-vms2d.dto';

@Injectable()
export class Vms2dService {
  constructor(
    @InjectRepository(Vms2d, 'mssqlDB')
    private readonly vms2dRepository: Repository<Vms2d>,
  ) {}

  create(createVmsDto: CreateVms2dDto) {
    return this.vms2dRepository.save(createVmsDto);
  }

  async findAll(query: Vms2d & BasicQueryParamDto) {
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

    return await this.vms2dRepository.find({
      where: {
        AWB_NUMBER: query.AWB_NUMBER
          ? ILike(`%${query.AWB_NUMBER}%`)
          : undefined,
      },
      order: orderByUtil(query.order),
      take: query.limit,
      skip: query.offset,
    });
  }

  async findOne(id: number) {
    // const result = await this.vms2dRepository.findOne({
    //   where: { id: id },
    // });
    // return result;
  }
}
