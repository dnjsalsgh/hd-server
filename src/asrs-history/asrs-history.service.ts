import { Injectable } from '@nestjs/common';
import { CreateAsrsHistoryDto } from './dto/create-asrs-history.dto';
import { UpdateAsrsHistoryDto } from './dto/update-asrs-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Asrs, AsrsAttribute } from '../asrs/entities/asrs.entity';
import {
  Between,
  Equal,
  FindOperator,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { AsrsHistory } from './entities/asrs-history.entity';
import { Awb, AwbAttribute } from '../awb/entities/awb.entity';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { orderByUtil } from '../lib/util/orderBy.util';

@Injectable()
export class AsrsHistoryService {
  constructor(
    @InjectRepository(AsrsHistory)
    private readonly asrsHistoryRepository: Repository<AsrsHistory>,
  ) {}

  async create(createAsrsHistoryDto: CreateAsrsHistoryDto) {
    return await this.asrsHistoryRepository.save(createAsrsHistoryDto);
  }

  async createList(createAsrsHistoryDto: CreateAsrsHistoryDto[]) {
    return await this.asrsHistoryRepository.save(createAsrsHistoryDto);
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
   * 창고에 가장 첫번째로 들어간 화물 체크
   */
  async getOldAwb() {
    // 메인 쿼리
    const oldestIn = await this.asrsHistoryRepository
      .createQueryBuilder('inHistory')
      .leftJoinAndSelect('inHistory.Asrs', 'Asrs')
      .leftJoinAndSelect('inHistory.Awb', 'Awb')
      .leftJoinAndSelect('Awb.Scc', 'Scc') // awb의 Scc를 반환합니다.
      .leftJoin(
        'asrs_history',
        'outHistory',
        "inHistory.asrs_id = outHistory.asrs_id AND inHistory.awb_id = outHistory.awb_id AND outHistory.in_out_type = 'out'",
      )
      .where('inHistory.in_out_type = :inType', { inType: 'in' })
      .andWhere('outHistory.id IS NULL')
      .orderBy('inHistory.created_at', 'ASC')
      .limit(1)
      .getOne();

    return oldestIn;
  }

  /**
   * 창고 이력에서 asrs_id를 기준으로 최신 안착대의 'in' 상태인거 모두 삭제
   */
  async resetAsrs() {
    const asrsState = await this.asrsHistoryRepository
      .createQueryBuilder('ah')
      .distinctOn(['ah.asrs_id'])
      .leftJoinAndSelect('ah.Asrs', 'Asrs')
      .leftJoinAndSelect('ah.Awb', 'Awb')
      .leftJoinAndSelect('Awb.Scc', 'Scc') // awb의 Scc를 반환합니다.
      .orderBy('ah.asrs_id')
      .addOrderBy('ah.id', 'DESC')
      .getMany(); // 또는 getMany()를 사용하여 엔터티로 결과를 가져올 수 있습니다.

    const asrsIds = asrsState.map(
      (asrsHistory) => (asrsHistory.Asrs as Asrs).id,
    );
    const awbIds = asrsState.map((asrsHistory) => (asrsHistory.Awb as Awb).id);
    if (asrsIds && asrsIds.length > 0 && awbIds && awbIds.length > 0) {
      const deleteResult = await this.asrsHistoryRepository
        .createQueryBuilder()
        .delete()
        .where('Asrs IN (:...asrsIds)', { asrsIds })
        .andWhere('Awb IN (:...awbIds)', { awbIds })
        .execute();
      return deleteResult;
    }
    return '창고가 비었습니다.';
  }

  async resetAsrsAll() {
    await this.asrsHistoryRepository.delete({});
    return '창고가 비었습니다.';
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
      order: orderByUtil(query.order),
      take: query.limit,
      skip: query.offset,
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
