import { Injectable } from '@nestjs/common';
import { CreateVmsAwbResultDto } from './dto/create-vms-awb-result.dto';
import { UpdateVmsAwbResultDto } from './dto/update-vms-awb-result.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vms3D } from '../vms/entities/vms.entity';
import {
  Between,
  FindOperator,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { CreateVmsDto } from '../vms/dto/create-vms.dto';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { orderByUtil } from '../lib/util/orderBy.util';
import { VmsAwbResult } from './entities/vms-awb-result.entity';

@Injectable()
export class VmsAwbResultService {
  constructor(
    @InjectRepository(VmsAwbResult, 'mssqlDB')
    private readonly vmsAwbResultRepository: Repository<VmsAwbResult>,
  ) {}

  create(CreateVmsAwbResultDto: CreateVmsAwbResultDto) {
    return this.vmsAwbResultRepository.save(CreateVmsAwbResultDto);
  }

  async findAll(query: VmsAwbResult & BasicQueryParamDto) {
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
    const result = await this.vmsAwbResultRepository.findOne({
      where: { id: id },
    });
    return result;
  }
}
