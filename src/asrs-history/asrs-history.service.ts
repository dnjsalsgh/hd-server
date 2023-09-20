import { Injectable } from '@nestjs/common';
import { CreateAsrsHistoryDto } from './dto/create-asrs-history.dto';
import { UpdateAsrsHistoryDto } from './dto/update-asrs-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Asrs, AsrsAttribute } from '../asrs/entities/asrs.entity';
import {
  Between,
  DataSource,
  Equal,
  FindOperator,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { AsrsHistory } from './entities/asrs-history.entity';
import { Awb, AwbAttribute } from '../awb/entities/awb.entity';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';

@Injectable()
export class AsrsHistoryService {
  constructor(
    @InjectRepository(AsrsHistory)
    private readonly asrsHistoryRepository: Repository<AsrsHistory>,
    private dataSource: DataSource,
  ) {}

  async create(createAsrsHistoryDto: CreateAsrsHistoryDto) {
    if (
      typeof createAsrsHistoryDto.Asrs === 'string' &&
      typeof createAsrsHistoryDto.Awb === 'string'
    ) {
      const AsrsResult = await this.dataSource.manager
        .getRepository(Asrs)
        .findOne({ where: { name: createAsrsHistoryDto.Asrs } });

      const AwbResult = await this.dataSource.manager
        .getRepository(Awb)
        .findOne({ where: { name: createAsrsHistoryDto.Awb } });

      // 창고, 화물의 이름으로 찾은 것들 id로 변환작업
      createAsrsHistoryDto.Asrs = AsrsResult.id;
      createAsrsHistoryDto.Awb = AwbResult.id;

      return await this.asrsHistoryRepository.save(
        createAsrsHistoryDto as AsrsHistory,
      );
    }
  }

  /**
   * 창고 이력에서 asrs_id를 기준으로 최신 안착대의 상태만 가져옴
   */
  async nowState() {
    const asrsState = await this.asrsHistoryRepository
      .createQueryBuilder('ah')
      .distinctOn(['ah.asrs_id'])
      .leftJoinAndSelect('ah.Asrs', 'Asrs')
      .leftJoinAndSelect('ah.Awb', 'Awb')
      .leftJoinAndSelect('Awb.Scc', 'Scc') // awb의 Scc를 반환합니다.
      // .where('ah.inOutType = :inOutType', { inOutType: 'in' }) // inOutType이 'in'인 경우 필터링
      .orderBy('ah.asrs_id')
      .addOrderBy('ah.id', 'DESC')
      .getMany(); // 또는 getMany()를 사용하여 엔터티로 결과를 가져올 수 있습니다.

    return asrsState.filter((v) => v.inOutType === 'in');
  }

  /**
   * 창고 이력에서 asrs_id를 기준으로 최신 안착대의 상태만 가져옴
   */
  async resetAsrs() {
    const asrsState = await this.asrsHistoryRepository
      .createQueryBuilder('ah')
      .distinctOn(['ah.asrs_id'])
      .leftJoinAndSelect('ah.Asrs', 'Asrs')
      .leftJoinAndSelect('ah.Awb', 'Awb')
      .leftJoinAndSelect('Awb.Scc', 'Scc') // awb의 Scc를 반환합니다.
      // .where('ah.inOutType = :inOutType', { inOutType: 'in' }) // inOutType이 'in'인 경우 필터링
      .orderBy('ah.asrs_id')
      .addOrderBy('ah.id', 'DESC')
      .getMany(); // 또는 getMany()를 사용하여 엔터티로 결과를 가져올 수 있습니다.

    const currentState = asrsState.filter((v) => v.inOutType === 'in');
    const ids = currentState.map((v) => v.id);
    const deleteResult = await this.asrsHistoryRepository.delete(ids);
    return deleteResult;
  }

  async findAll(query: AsrsHistory & BasicQueryParamDto) {
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
    return await this.asrsHistoryRepository.find({
      select: {
        Asrs: AsrsAttribute,
        Awb: AwbAttribute,
      },
      relations: {
        Asrs: true,
        Awb: true,
      },
      where: {
        // join 되는 테이블들의 FK를 typeorm 옵션에 맞추기위한 조정하기 위한 과정
        Asrs: query.Asrs ? Equal(+query.Asrs) : undefined,
        Awb: query.Awb ? Equal(+query.Awb) : undefined,
        createdAt: findDate,
      },
    });
  }

  async findOne(id: number) {
    const result = await this.asrsHistoryRepository.findOne({
      where: { id: id },
      select: {
        Asrs: AsrsAttribute,
        Awb: AwbAttribute,
      },
      relations: {
        Asrs: true,
        Awb: true,
      },
    });
    return result;
  }

  update(id: number, updateAsrsHistoryDto: UpdateAsrsHistoryDto) {
    return this.asrsHistoryRepository.update(
      id,
      updateAsrsHistoryDto as AsrsHistory,
    );
  }

  remove(id: number) {
    return this.asrsHistoryRepository.delete(id);
  }
}
