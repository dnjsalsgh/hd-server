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
import { BasicQueryParam } from '../lib/dto/basicQueryParam';

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

  async findAll(query: AsrsHistory & BasicQueryParam) {
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
    });
    return result;
  }

  update(id: number, updateAsrsHistoryDto: UpdateAsrsHistoryDto) {
    return this.asrsHistoryRepository.update(id, updateAsrsHistoryDto);
  }

  remove(id: number) {
    return this.asrsHistoryRepository.delete(id);
  }
}
