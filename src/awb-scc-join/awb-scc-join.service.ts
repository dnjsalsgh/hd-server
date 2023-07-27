import { Injectable } from '@nestjs/common';
import { CreateAwbSccJoinDto } from './dto/create-awb-scc-join.dto';
import { UpdateAwbSccJoinDto } from './dto/update-awb-scc-join.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  Equal,
  FindOperator,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { AwbSccJoin } from './entities/awb-scc-join.entity';
import { AsrsHistory } from '../asrs-history/entities/asrs-history.entity';
import { BasicQueryParam } from '../lib/dto/basicQueryParam';
import { AsrsAttribute } from '../asrs/entities/asrs.entity';
import { AwbAttribute } from '../awb/entities/awb.entity';
import { SccAttribute } from '../scc/entities/scc.entity';

@Injectable()
export class AwbSccJoinService {
  constructor(
    @InjectRepository(AwbSccJoin)
    private readonly awbSccJoinRepository: Repository<AwbSccJoin>,
  ) {}
  create(createAwbSccJoinDto: CreateAwbSccJoinDto) {
    return this.awbSccJoinRepository.save(createAwbSccJoinDto);
  }

  findAll(query: AwbSccJoin & BasicQueryParam) {
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
    return this.awbSccJoinRepository.find({
      select: {
        Scc: SccAttribute,
        Awb: AwbAttribute,
      },
      relations: {
        Scc: true,
        Awb: true,
      },
      where: {
        // join 되는 테이블들의 FK를 typeorm 옵션에 맞추기위한 조정하기 위한 과정
        Scc: query.Scc ? Equal(+query.Scc) : undefined,
        Awb: query.Awb ? Equal(+query.Awb) : undefined,
        createdAt: findDate,
      },
    });
  }

  findOne(id: number) {
    return this.awbSccJoinRepository.find({ where: { id: id } });
  }

  update(id: number, updateCargoSccJoinDto: UpdateAwbSccJoinDto) {
    return this.awbSccJoinRepository.update(id, updateCargoSccJoinDto);
  }

  remove(id: number) {
    return this.awbSccJoinRepository.delete(id);
  }
}
