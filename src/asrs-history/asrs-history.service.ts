import { Injectable } from '@nestjs/common';
import { CreateAsrsHistoryDto } from './dto/create-asrs-history.dto';
import { UpdateAsrsHistoryDto } from './dto/update-asrs-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Asrs, AsrsAttribute } from '../asrs/entities/asrs.entity';
import {
  Between,
  DataSource,
  Equal,
  EqualOperator,
  FindOperator,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
  TypeORMError,
} from 'typeorm';
import { AsrsHistory } from './entities/asrs-history.entity';
import { Awb, AwbAttribute } from '../awb/entities/awb.entity';
import { CreateAsrsPlcDto } from '../asrs/dto/create-asrs-plc.dto';
import { QueryParam } from '../lib/dto/query.param';

@Injectable()
export class AsrsHistoryService {
  constructor(
    @InjectRepository(AsrsHistory)
    private readonly asrsHistoryRepository: Repository<AsrsHistory>,
    private dataSource: DataSource,
  ) {}

  async create(createAsrsHistoryDto: CreateAsrsHistoryDto) {
    if (
      typeof createAsrsHistoryDto.Asrs === 'number' &&
      typeof createAsrsHistoryDto.Awb === 'number'
    ) {
      return await this.asrsHistoryRepository.save(createAsrsHistoryDto);
    }
  }

  async findAll(query: AsrsHistory & QueryParam) {
    // join 되는 테이블들의 FK를 typeorm에 맞추기위한 조정하기 위한 과정
    let asrsId: EqualOperator<number>;
    if (query.Asrs) asrsId = Equal(+query.Asrs);
    let awbId: EqualOperator<number>;
    if (query.Awb) awbId = Equal(+query.Awb);

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
        Asrs: asrsId,
        Awb: awbId,
        createdAt: findDate,
      },
    });
  }

  async findOne(id: number) {
    const result = await this.asrsHistoryRepository.findOne({
      where: { id: id },
    });
    return result;
  }

  update(id: number, updateAsrsHistoryDto: UpdateAsrsHistoryDto) {
    return this.asrsHistoryRepository.update(id, updateAsrsHistoryDto);
  }

  remove(id: number) {
    return this.asrsHistoryRepository.delete(id);
  }

  /**
   * plc로 들어온 데이터를 가지고 이력 등록
   * awb와 asrs의 정보를 처리해야함
   * @param body
   */
  async createByPlc(body: CreateAsrsPlcDto) {
    // 자동창고 Id 들어왔다고 가정
    const asrsId = +body.LH_ASRS_ID;

    // const awbInfo = JSON.parse(body.ASRS_LH_Rack1_Part_Info);
    // 화물정보 안에 화물Id 들어왔다고 가정
    // const awbId = +awbInfo.awbId;
    // 화물정보 안에 화물수량 들어왔다고 가정
    // const count = awbInfo.count;
    // 화물이 인입인지 인출인지 확인
    let inOutType = '';
    if (body.In_Conveyor_Start) {
      inOutType = 'in';
    } else if (body.Out_Conveyor_Start) {
      inOutType = 'out';
    }

    // const asrsHistoryBody: CreateAsrsHistoryDto = {
    //   Asrs: asrsId,
    //   Awb: awbId,
    //   inOutType: inOutType,
    //   count: count,
    // };
    // await this.asrsHistoryRepository.save(asrsHistoryBody);
  }
}
