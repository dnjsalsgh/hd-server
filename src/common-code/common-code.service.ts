import { Injectable } from '@nestjs/common';
import { CreateCommonCodeDto } from './dto/create-common-code.dto';
import { UpdateCommonCodeDto } from './dto/update-common-code.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonCode } from './entities/common-code.entity';
import {
  Between,
  FindOperator,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { BasicqueryparamDto } from '../lib/dto/basicqueryparam.dto';
import { orderByUtil } from '../lib/util/orderBy.util';

@Injectable()
export class CommonCodeService {
  constructor(
    @InjectRepository(CommonCode)
    private readonly commonCodeRepository: Repository<CommonCode>,
  ) {}
  async create(createCommonCodeDto: CreateCommonCodeDto) {
    const result = await this.commonCodeRepository.save(createCommonCodeDto);
    return result;
  }

  async findAll(query: CommonCode & BasicqueryparamDto) {
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
    return await this.commonCodeRepository.find({
      where: {
        name: query.name ? ILike(`%${query.name}%`) : undefined,
        code: query.code ? ILike(`%${query.code}%`) : undefined,
        type: query.type ? ILike(`%${query.type}%`) : undefined,
        createdAt: findDate,
      },
      order: orderByUtil(query.order),
      take: query.limit,
      skip: query.offset,
    });
  }

  async findOne(id: number) {
    return await this.commonCodeRepository.find({ where: { id: id } });
  }

  update(id: number, updateCommonCodeDto: UpdateCommonCodeDto) {
    return this.commonCodeRepository.update(id, updateCommonCodeDto);
  }

  remove(id: number) {
    return this.commonCodeRepository.delete(id);
  }
}
