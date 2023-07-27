import { Injectable } from '@nestjs/common';
import { CreateSimulatorHistoryDto } from './dto/create-simulator-history.dto';
import { UpdateSimulatorHistoryDto } from './dto/update-simulator-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Scc } from '../scc/entities/scc.entity';
import {
  Between,
  Equal,
  FindOperator,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { CreateSccDto } from '../scc/dto/create-scc.dto';
import { UpdateSccDto } from '../scc/dto/update-scc.dto';
import { SimulatorHistory } from './entities/simulator-history.entity';
import { BasicQueryParam } from '../lib/dto/basicQueryParam';
import { AsrsAttribute } from '../asrs/entities/asrs.entity';
import { AwbAttribute } from '../awb/entities/awb.entity';
import { UldAttribute } from '../uld/entities/uld.entity';
import { SimulatorResultAttribute } from '../simulator-result/entities/simulator-result.entity';

@Injectable()
export class SimulatorHistoryService {
  constructor(
    @InjectRepository(SimulatorHistory)
    private readonly simulatorHistoryRepository: Repository<SimulatorHistory>,
  ) {}

  async create(createSimulatorHistoryDto: CreateSimulatorHistoryDto) {
    const result = await this.simulatorHistoryRepository.save(
      createSimulatorHistoryDto,
    );
    return result;
  }

  async findAll(query: SimulatorHistory & BasicQueryParam) {
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
    return await this.simulatorHistoryRepository.find({
      select: {
        SimulatorResult: SimulatorResultAttribute,
        Uld: UldAttribute,
        Awb: AwbAttribute,
      },
      relations: {
        SimulatorResult: true,
        Uld: true,
        Awb: true,
      },
      where: {
        // join 되는 테이블들의 FK를 typeorm 옵션에 맞추기위한 조정하기 위한 과정
        SimulatorResult: query.SimulatorResult
          ? Equal(+query.SimulatorResult)
          : undefined,
        Uld: query.Uld ? Equal(+query.Uld) : undefined,
        Awb: query.Awb ? Equal(+query.Awb) : undefined,
        createdAt: findDate,
      },
    });
  }

  async findOne(id: number) {
    return await this.simulatorHistoryRepository.find({ where: { id: id } });
  }

  update(id: number, updateSimulatorHistoryDto: UpdateSimulatorHistoryDto) {
    return this.simulatorHistoryRepository.update(
      id,
      updateSimulatorHistoryDto,
    );
  }

  remove(id: number) {
    return this.simulatorHistoryRepository.delete(id);
  }
}
