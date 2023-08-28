import { Injectable } from '@nestjs/common';
import { CreateAmrChargeHistoryDto } from './dto/create-amr-charge-history.dto';
import { UpdateAmrChargeHistoryDto } from './dto/update-amr-charge-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindOperator,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { AmrChargeHistory } from './entities/amr-charge-history.entity';
import { orderByUtil } from '../lib/util/orderBy.util';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';

@Injectable()
export class AmrChargeHistoryService {
  constructor(
    @InjectRepository(AmrChargeHistory)
    private readonly amrChargeHistoryRepository: Repository<AmrChargeHistory>,
  ) {}
  create(createAmrChargeHistoryDto: CreateAmrChargeHistoryDto) {
    return this.amrChargeHistoryRepository.save(createAmrChargeHistoryDto);
  }

  findAll(
    query: AmrChargeHistory &
      BasicQueryParamDto & {
        chargeStartFrom: Date;
        chargeStartTo: Date;
        chargeEndFrom: Date;
        chargeEndTo: Date;
      },
  ) {
    const {
      createdAtFrom,
      createdAtTo,
      chargeStartFrom,
      chargeStartTo,
      chargeEndFrom,
      chargeEndTo,
    } = query;
    // createdAt 기간검색 처리
    let findDate: FindOperator<Date>;
    if (createdAtFrom && createdAtTo) {
      findDate = Between(createdAtFrom, createdAtTo);
    } else if (createdAtFrom) {
      findDate = MoreThanOrEqual(createdAtFrom);
    } else if (createdAtTo) {
      findDate = LessThanOrEqual(createdAtTo);
    }

    // chargeStart 기간검색 처리
    let findStartDate: FindOperator<Date>;
    if (chargeStartFrom && chargeStartTo) {
      findStartDate = Between(chargeStartFrom, chargeStartTo);
    } else if (chargeStartFrom) {
      findStartDate = MoreThanOrEqual(chargeStartFrom);
    } else if (chargeStartTo) {
      findStartDate = LessThanOrEqual(chargeStartTo);
    }

    // chargeEnd 기간검색 처리
    let findEndDate: FindOperator<Date>;
    if (chargeEndFrom && chargeEndTo) {
      findEndDate = Between(chargeEndFrom, chargeEndTo);
    } else if (chargeEndFrom) {
      findEndDate = MoreThanOrEqual(chargeEndFrom);
    } else if (chargeEndTo) {
      findEndDate = LessThanOrEqual(chargeEndTo);
    }

    return this.amrChargeHistoryRepository.find({
      where: {
        soc: query.soc,
        soh: query.soh,
        chargeStart: findStartDate,
        chargeEnd: findEndDate,
        createdAt: findDate,
      },
      order: orderByUtil(query.order),
      take: query.limit,
      skip: query.offset,
    });
  }

  findOne(id: number) {
    return this.amrChargeHistoryRepository.find({ where: { id: id } });
  }

  update(id: number, updateAmrChargeHistoryDto: UpdateAmrChargeHistoryDto) {
    return this.amrChargeHistoryRepository.update(
      id,
      updateAmrChargeHistoryDto,
    );
  }

  remove(id: number) {
    return this.amrChargeHistoryRepository.delete(id);
  }
}
