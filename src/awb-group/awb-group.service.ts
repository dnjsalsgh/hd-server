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
import { AwbGroup } from './entities/awb-group.entity';
import { CreateAwbGroupDto } from './dto/create-awb-group.dto';
import { UpdateAwbGroupDto } from './dto/update-awb-group.dto';
import { BasicqueryparamDto } from '../lib/dto/basicqueryparam.dto';
import { orderByUtil } from '../lib/util/orderBy.util';

@Injectable()
export class AwbGroupService {
  constructor(
    @InjectRepository(AwbGroup)
    private readonly awbGroupRepository: Repository<AwbGroup>,
  ) {}
  create(createCargoGroupDto: CreateAwbGroupDto) {
    return this.awbGroupRepository.save(createCargoGroupDto);
  }

  findAll(query: AwbGroup & BasicqueryparamDto) {
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
    return this.awbGroupRepository.find({
      where: {
        name: query.name ? ILike(`%${query.name}%`) : undefined,
        code: query.code ? ILike(`%${query.code}%`) : undefined,
        createdAt: findDate,
      },
      order: orderByUtil(query.order),
      take: query.limit,
      skip: query.offset,
    });
  }

  findOne(id: number) {
    return this.awbGroupRepository.find({ where: { id: id } });
  }

  update(id: number, updateCargoGroupDto: UpdateAwbGroupDto) {
    return this.awbGroupRepository.update(id, updateCargoGroupDto);
  }

  remove(id: number) {
    return this.awbGroupRepository.delete(id);
  }
}
