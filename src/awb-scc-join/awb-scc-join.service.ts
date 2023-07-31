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
import { Awb, AwbAttribute } from '../awb/entities/awb.entity';
import { Scc, SccAttribute } from '../scc/entities/scc.entity';

@Injectable()
export class AwbSccJoinService {
  constructor(
    @InjectRepository(AwbSccJoin)
    private readonly awbSccJoinRepository: Repository<AwbSccJoin>,
    @InjectRepository(Awb)
    private readonly awbRepository: Repository<Awb>,
    @InjectRepository(Scc)
    private readonly sccRepository: Repository<Scc>,
  ) {}
  create(createAwbSccJoinDto: CreateAwbSccJoinDto) {
    return this.awbSccJoinRepository.save(createAwbSccJoinDto);
  }

  async findAll(
    query: AwbSccJoin & BasicQueryParam,
    SccName: string,
    AwbName: string,
  ) {
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

    let sccResult;
    let awbResult;
    if (SccName) {
      sccResult = await this.sccRepository.findOne({
        where: { name: SccName },
      });
    }
    if (AwbName) {
      awbResult = await this.awbRepository.findOne({
        where: { name: AwbName },
      });
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
        Scc: sccResult ? Equal(+sccResult.id) : undefined,
        Awb: awbResult ? Equal(+awbResult.id) : undefined,
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
