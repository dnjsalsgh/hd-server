import { Injectable } from '@nestjs/common';
import { CreateAwbReturnDto } from './dto/create-awb-return.dto';
import { UpdateAwbReturnDto } from './dto/update-awb-return.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AwbReturn } from './entities/awb-return.entity';
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

@Injectable()
export class AwbReturnService {
  constructor(
    @InjectRepository(AwbReturn)
    private readonly awbReturnRepository: Repository<AwbReturn>,
  ) {}

  async create(createAwbReturnDto: CreateAwbReturnDto) {
    const insertResult = await this.awbReturnRepository.save(
      createAwbReturnDto,
    );

    return insertResult;
  }

  async findAll(query: AwbReturn & BasicQueryParamDto) {
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

    const findResult = await this.awbReturnRepository.find({
      where: {
        createdAt: findDate,
      },
      order: orderByUtil(query.order),
      take: query.limit,
      skip: query.offset,
    });

    return findResult;
  }

  findOne(id: number) {
    return this.awbReturnRepository.find({ where: { id: id } });
  }

  update(id: number, updateAwbReturnDto: UpdateAwbReturnDto) {
    return this.awbReturnRepository.update(id, updateAwbReturnDto);
  }

  remove(id: number) {
    return this.awbReturnRepository.delete(id);
  }
}
