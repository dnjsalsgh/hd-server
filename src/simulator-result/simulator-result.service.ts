import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SimulatorResult } from './entities/simulator-result.entity';
import { DataSource, Repository, TypeORMError } from 'typeorm';
import { CreateSimulatorResultDto } from './dto/create-simulator-result.dto';
import { UpdateSimulatorResultDto } from './dto/update-simulator-result.dto';
import { UldAttribute } from '../uld/entities/uld.entity';
import { CreateSimulatorResultWithAwbAndHistoryDto } from './dto/create-simulator-result-with-awb';
import { SimulatorResultAwbJoin } from '../simulator-result-awb-join/entities/simulator-result-awb-join.entity';
import { SimulatorHistory } from '../simulator-history/entities/simulator-history.entity';
import { CreateSimulatorHistoryDto } from '../simulator-history/dto/create-simulator-history.dto';
import { CreateSimulatorResultAwbJoinDto } from '../simulator-result-awb-join/dto/create-simulator-result-awb-join.dto';

@Injectable()
export class SimulatorResultService {
  constructor(
    @InjectRepository(SimulatorResult)
    private readonly simulatorResultRepository: Repository<SimulatorResult>,
    private dataSource: DataSource,
  ) {}

  async create(createSimulatorResultDto: CreateSimulatorResultDto) {
    const result = await this.simulatorResultRepository.save(
      createSimulatorResultDto,
    );
    return result;
  }

  async createWithAwb(body: CreateSimulatorResultWithAwbAndHistoryDto) {
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Awb의 정보 validation 체크
      if (
        !body.AwbWithXYZ.every(
          (obj) => 'Awb' in obj && 'x' in obj && 'y' in obj && 'z' in obj,
        )
      ) {
        throw new NotFoundException('Awb 상세 정보가 없습니다.');
      }

      // 1. simulatorResult 입력
      const simulatorResultResult = await this.dataSource.manager
        .getRepository(SimulatorResult)
        .save(body);

      const joinParamArray: CreateSimulatorResultAwbJoinDto[] = [];
      const historyParamArray: CreateSimulatorHistoryDto[] = [];

      // 2. 입력되는 화물과 좌표를 이력에 입력
      for (let i = 0; i < body.AwbWithXYZ.length; i++) {
        // 2-1. Awb 이력 입력
        const joinParam: CreateSimulatorResultAwbJoinDto = {
          Awb: body.AwbWithXYZ[i].Awb,
          SimulatorResult: simulatorResultResult.id,
        };
        joinParamArray.push(joinParam);

        // 2-2. SimulatorHistory 입력
        const historyParam: CreateSimulatorHistoryDto = {
          Uld: body.Uld,
          Awb: body.AwbWithXYZ[i].Awb,
          SimulatorResult: simulatorResultResult.id,
          x: body.AwbWithXYZ[i].x,
          y: body.AwbWithXYZ[i].y,
          z: body.AwbWithXYZ[i].z,
        };
        historyParamArray.push(historyParam);
      }

      const joinResult = this.dataSource.manager
        .getRepository(SimulatorResultAwbJoin)
        .save(joinParamArray);
      const historyResult = this.dataSource.manager
        .getRepository(SimulatorHistory)
        .save(historyParamArray);

      // awbjoin 테이블, 이력 테이블 함께 저장
      await Promise.all([joinResult, historyResult]);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new TypeORMError(`rollback Working - ${error}`);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return await this.simulatorResultRepository.find({
      relations: {
        Uld: true,
      },
      select: {
        Uld: UldAttribute,
      },
    });
  }

  async findOne(id: number) {
    return await this.simulatorResultRepository.find({ where: { id: id } });
  }

  update(id: number, updateSimulatorResultDto: UpdateSimulatorResultDto) {
    return this.simulatorResultRepository.update(id, updateSimulatorResultDto);
  }

  remove(id: number) {
    return this.simulatorResultRepository.delete(id);
  }
}
