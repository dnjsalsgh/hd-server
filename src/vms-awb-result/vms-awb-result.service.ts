import { Injectable } from '@nestjs/common';
import { CreateVmsAwbResultDto } from './dto/create-vms-awb-result.dto';
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
import { VmsAwbResult } from './entities/vms-awb-result.entity';

@Injectable()
export class VmsAwbResultService {
  constructor(
    @InjectRepository(VmsAwbResult, 'dimoaDB')
    private readonly vmsAwbResultRepository: Repository<VmsAwbResult>,
  ) {}

  create(CreateVmsAwbResultDto: CreateVmsAwbResultDto) {
    return this.vmsAwbResultRepository.save(CreateVmsAwbResultDto);
  }

  async findAll(query: VmsAwbResult & BasicQueryParamDto) {
    return await this.vmsAwbResultRepository.find({
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
    // const result = await this.vmsAwbResultRepository.findOne({
    //   where: { id: id },
    // });
    // return result;
  }
}
