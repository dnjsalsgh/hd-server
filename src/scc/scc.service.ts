import { Injectable } from '@nestjs/common';
import { CreateSccDto } from './dto/create-scc.dto';
import { UpdateSccDto } from './dto/update-scc.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindOperator,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Scc } from './entities/scc.entity';
import { BasicQueryParam } from '../lib/dto/basicQueryParam';
import { getOrderBy } from '../lib/util/getOrderBy';

@Injectable()
export class SccService {
  constructor(
    @InjectRepository(Scc)
    private readonly sccRepository: Repository<Scc>,
  ) {}
  async create(createSccDto: CreateSccDto) {
    const result = await this.sccRepository.save(createSccDto);
    return result;
  }

  async findAll(query: Scc & BasicQueryParam) {
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

    const searchResult = await this.sccRepository.find({
      where: {
        name: query.name ? ILike(`%${query.name}%`) : undefined,
        code: query.code ? ILike(`%${query.code}%`) : undefined,
        createdAt: findDate,
      },
      order: getOrderBy(query.order),
      take: query.limit,
      skip: query.offset,
      relations: {
        Awb: true,
      },
    });

    return searchResult;
  }

  async findOne(id: number) {
    return await this.sccRepository.find({
      where: { id: id },
      relations: {
        Awb: true,
      },
    });
  }

  async update(id: number, updateSccDto: UpdateSccDto) {
    const updateResult = await this.sccRepository.update(id, updateSccDto);
    return updateResult;
  }

  remove(id: number) {
    return this.sccRepository.delete(id);
  }
}
