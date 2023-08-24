import { Injectable } from '@nestjs/common';
import { CreateBuildUpOrderDto } from './dto/create-build-up-order.dto';
import { UpdateBuildUpOrderDto } from './dto/update-build-up-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  DataSource,
  Equal,
  FindOperator,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
  TypeORMError,
} from 'typeorm';
import { BuildUpOrder } from './entities/build-up-order.entity';
import { SkidPlatformAttribute } from '../skid-platform/entities/skid-platform.entity';
import { UldAttribute } from '../uld/entities/uld.entity';
import { AwbAttribute } from '../awb/entities/awb.entity';
import { UldHistory } from '../uld-history/entities/uld-history.entity';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';

@Injectable()
export class BuildUpOrderService {
  constructor(
    @InjectRepository(BuildUpOrder)
    private readonly buildUpOrderRepository: Repository<BuildUpOrder>,
    @InjectRepository(UldHistory)
    private readonly uldHistoryRepository: Repository<UldHistory>,
    private dataSource: DataSource,
  ) {}
  async create(createBuildUpOrderDto: CreateBuildUpOrderDto) {
    const result = await this.buildUpOrderRepository.save(
      createBuildUpOrderDto,
    );
    return result;
  }

  async createList(createBuildUpOrderDto: CreateBuildUpOrderDto[]) {
    // 등록된 Awb, buildUpOrder는 삭제하지 않기 위해서 uld의 이력을 가져옵니다.
    const uldHistoryResult = await this.uldHistoryRepository.find({
      where: { Uld: createBuildUpOrderDto[0].Uld },
      relations: { Uld: true, Awb: true, BuildUpOrder: true },
      select: {
        Uld: { id: true },
        Awb: { id: true },
        BuildUpOrder: { id: true },
      },
    });

    // 이력에서 awbId 정보만 가져옵니다.
    const buildUpOrderAwb = uldHistoryResult.map((v) => {
      if (typeof v.Awb !== 'number') return v.Awb.id;
    });

    // 등록된 awb는 제외합니다.
    const filteredBuildUpOrderBody = createBuildUpOrderDto.filter(
      (v) => !buildUpOrderAwb.includes(v.Awb as number),
    );

    // 작업지시의 삭제, 재등록을 위해 transaction 처리합니다.
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 이력에 등록된 작업지시를 제외하고 삭제합니다.
      for (const body of filteredBuildUpOrderBody) {
        await this.dataSource.getRepository(BuildUpOrder).delete({
          Uld: body.Uld,
          Awb: body.Awb,
        });
      }
      // 새로운 작업지시를 등록합니다.
      const result = await this.dataSource
        .getRepository(BuildUpOrder)
        .upsert(filteredBuildUpOrderBody, ['Awb', 'Uld']);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new TypeORMError(`rollback Working - ${error}`);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(query: BuildUpOrder & BasicQueryParamDto) {
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
    return await this.buildUpOrderRepository.find({
      relations: {
        SkidPlatform: true,
        Uld: true,
        Awb: true,
      },
      select: {
        SkidPlatform: SkidPlatformAttribute,
        Uld: UldAttribute,
        Awb: AwbAttribute,
      },
      where: {
        // join 되는 테이블들의 FK를 typeorm 옵션에 맞추기위한 조정하기 위한 과정
        SkidPlatform: query.SkidPlatform
          ? Equal(+query.SkidPlatform)
          : undefined,
        Uld: query.Uld ? Equal(+query.Uld) : undefined,
        Awb: query.Awb ? Equal(+query.Awb) : undefined,
        createdAt: findDate,
      },
    });
  }

  async findOne(id: number) {
    return await this.buildUpOrderRepository.find({
      where: { id: id },
      relations: {
        SkidPlatform: true,
        Uld: true,
        Awb: true,
      },
      select: {
        SkidPlatform: SkidPlatformAttribute,
        Uld: UldAttribute,
        Awb: AwbAttribute,
      },
    });
  }

  update(id: number, updateBuildUpOrderDto: UpdateBuildUpOrderDto) {
    return this.buildUpOrderRepository.update(id, updateBuildUpOrderDto);
  }

  remove(id: number) {
    return this.buildUpOrderRepository.delete(id);
  }
}
