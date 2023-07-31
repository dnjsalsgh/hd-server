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
import { AwbSccJoin } from '../awb-scc-join/entities/awb-scc-join.entity';

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

    // return await this.sccRepository
    //   .createQueryBuilder()
    //   .leftJoinAndSelect('awbSccJoin.Scc', 'Scc')
    //   .where('Scc.name = :sccName', { sccName: query.name })
    //   .getMany();

    // await this.sccRepository
    //   .createQueryBuilder()
    //   .select(['scc.id', 'asj.awb_id', 'asj.scc_id'])
    //   .addSelect('awb.*')
    //   .innerJoin('AwbSccJoin', 'asj', 'scc.id = asj.scc_id')
    //   .innerJoin('Awb', 'awb', 'asj.awb_id = awb.id')
    //   .where('sc.name = :name', { name: query.name })
    //   .getRawMany();

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
        awbSccJoin: {
          Awb: true,
        },
      },
    });

    const filteredData = searchResult.map((item) => {
      const { awbSccJoin, ...itemWithout } = item;
      return {
        ...itemWithout,
        Awb: item.awbSccJoin.map((Item) => Item.Awb),
      };
    });
    return filteredData;
  }

  async findOne(id: number) {
    return await this.sccRepository.find({ where: { id: id } });
  }

  async update(id: number, updateSccDto: UpdateSccDto) {
    const updateResult = await this.sccRepository.update(id, updateSccDto);
    // const updateResult1 = await this.sccRepository
    //   .createQueryBuilder()
    //   .update(Scc)
    //   .set(updateSccDto)
    //   .where('id = :id', { id: id })
    //   .execute();

    return updateResult;
  }

  remove(id: number) {
    return this.sccRepository.delete(id);
  }
}
