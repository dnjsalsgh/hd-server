import { Injectable } from '@nestjs/common';
import { CreateSccDto } from './dto/create-scc.dto';
import { UpdateSccDto } from './dto/update-scc.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindOperator,
  ILike,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Scc } from './entities/scc.entity';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { orderByUtil } from '../lib/util/orderBy.util';
import { Basic } from '../basic/entities/basic.entity';

@Injectable()
export class SccService {
  constructor(
    @InjectRepository(Scc)
    private readonly sccRepository: Repository<Scc>,
    @InjectRepository(Basic)
    private readonly basicRepository: Repository<Basic>,
  ) {}

  async create(createSccDto: CreateSccDto) {
    const result = await this.sccRepository.save(createSccDto);
    return result;
  }

  async findAll(query: Scc & BasicQueryParamDto) {
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
      order: orderByUtil(query.order),
      take: query.limit,
      skip: query.offset,
      relations: {
        Awb: true,
      },
    });

    return searchResult;
  }

  async findBanList(query: Scc & BasicQueryParamDto) {
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
      order: orderByUtil(query.order),
      take: query.limit,
      skip: query.offset,
      select: {
        code: true,
        banList: true,
      },
    });

    return searchResult;
  }

  async findByNames(sccNames: string[]) {
    const sccResult = await this.sccRepository.find({
      where: { code: In(sccNames) },
    });
    return sccResult;
  }

  async findByName(sccName: string) {
    const sccResult = await this.sccRepository.find({
      where: { code: sccName },
    });
    return sccResult;
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
