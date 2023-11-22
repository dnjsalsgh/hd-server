import { Injectable } from '@nestjs/common';
import { CreateHacsDto } from './dto/create-hacs.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { orderByUtil } from '../lib/util/orderBy.util';
import { Hacs } from './entities/hacs.entity';

@Injectable()
export class HacsService {
  constructor(
    @InjectRepository(Hacs, 'amrDB')
    private readonly hacsRepository: Repository<Hacs>,
  ) {}

  create(createHacsDto: CreateHacsDto) {
    return this.hacsRepository.save(createHacsDto);
  }

  async findAll(query: Hacs & BasicQueryParamDto) {
    return await this.hacsRepository.find({
      where: {},
      order: orderByUtil(query.order),
      take: query.limit,
      skip: query.offset,
    });
  }

  async findOne(id: number) {
    const result = await this.hacsRepository.findOne({
      where: { Amrld: id },
    });
    return result;
  }
}
