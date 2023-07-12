import { Injectable } from '@nestjs/common';
import { CreateAsrsHistoryDto } from './dto/create-asrs-history.dto';
import { UpdateAsrsHistoryDto } from './dto/update-asrs-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Asrs, AsrsAttribute } from '../asrs/entities/asrs.entity';
import { DataSource, Repository, TypeORMError } from 'typeorm';
import { AsrsHistory } from './entities/asrs-history.entity';
import { Awb, AwbAttribute } from '../awb/entities/awb.entity';

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

  async createWithObject(createAsrsHistoryDto: CreateAsrsHistoryDto) {
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const asrsResult = await this.dataSource.manager
        .getRepository(Asrs)
        .save(createAsrsHistoryDto.Asrs);

      const awbResult = await this.dataSource.manager
        .getRepository(Awb)
        .save(createAsrsHistoryDto.Awb);

      const resultParam = {
        Asrs: asrsResult,
        awb: awbResult,
      };
      await this.dataSource.manager
        .getRepository(AsrsHistory)
        .save(resultParam);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new TypeORMError(`rollback Working - ${error}`);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return await this.asrsHistoryRepository.find({
      select: {
        Asrs: AsrsAttribute,
        Awb: AwbAttribute,
      },
      relations: {
        Asrs: true,
        Awb: true,
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
