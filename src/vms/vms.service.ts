import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vms3D } from './entities/vms.entity';
import { ILike, Repository } from 'typeorm';
import { CreateVmsDto } from './dto/create-vms.dto';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { orderByUtil } from '../lib/util/orderBy.util';

@Injectable()
export class VmsService {
  constructor(
    @InjectRepository(Vms3D, 'mssqlDB')
    private readonly vmsRepository: Repository<Vms3D>,
  ) {}

  create(createVmsDto: CreateVmsDto) {
    return this.vmsRepository.save(createVmsDto);
  }

  async findAll(query: Vms3D & BasicQueryParamDto) {
    return await this.vmsRepository.find({
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

  async findOne(id: number) {}
}
