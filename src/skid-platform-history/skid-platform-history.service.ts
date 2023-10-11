import {
  Between,
  DataSource,
  Equal,
  FindOperator,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { take } from 'rxjs';
import { CreateSkidPlatformAndAsrsPlcDto } from './dto/plc-data-intersection.dto';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Inject, Injectable } from '@nestjs/common';
import { CreateSkidPlatformHistoryDto } from './dto/create-skid-platform-history.dto';
import { UpdateSkidPlatformHistoryDto } from './dto/update-skid-platform-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SkidPlatformHistory } from './entities/skid-platform-history.entity';
import { Awb, AwbAttribute } from '../awb/entities/awb.entity';
import { Asrs, AsrsAttribute } from '../asrs/entities/asrs.entity';
import {
  SkidPlatform,
  SkidPlatformAttribute,
} from '../skid-platform/entities/skid-platform.entity';
import {
  AsrsOutOrder,
  AsrsOutOrderAttribute,
} from '../asrs-out-order/entities/asrs-out-order.entity';

@Injectable()
export class SkidPlatformHistoryService {
  constructor(
    @InjectRepository(SkidPlatformHistory)
    private readonly skidPlatformHistoryRepository: Repository<SkidPlatformHistory>,
    @InjectRepository(AsrsOutOrder)
    private readonly asrsOutOrderRepository: Repository<AsrsOutOrder>,
    @Inject('MQTT_SERVICE') private client: ClientProxy,
    private dataSource: DataSource,
  ) {}
  async create(createSkidPlatformHistoryDto: CreateSkidPlatformHistoryDto) {
    if (
      typeof createSkidPlatformHistoryDto.Asrs === 'string' &&
      typeof createSkidPlatformHistoryDto.Awb === 'string' &&
      typeof createSkidPlatformHistoryDto.SkidPlatform === 'string'
    ) {
      const AsrsResult = await this.dataSource.manager
        .getRepository(Asrs)
        .findOne({ where: { name: createSkidPlatformHistoryDto.Asrs } });

      const AwbResult = await this.dataSource.manager
        .getRepository(Awb)
        .findOne({ where: { barcode: createSkidPlatformHistoryDto.Awb } });

      const SkidPlatformResult = await this.dataSource.manager
        .getRepository(SkidPlatform)
        .findOne({
          where: { name: createSkidPlatformHistoryDto.SkidPlatform },
        });

      // 창고, 화물, 안착대의 이름으로 찾은 것들 id로 변환작업
      createSkidPlatformHistoryDto.Asrs = AsrsResult.id;
      createSkidPlatformHistoryDto.Awb = AwbResult.id;
      createSkidPlatformHistoryDto.SkidPlatform = SkidPlatformResult.id;

      const historyResult = await this.skidPlatformHistoryRepository.save(
        createSkidPlatformHistoryDto as SkidPlatformHistory,
      );

      const historyResultObject = await this.skidPlatformHistoryRepository.find(
        {
          select: {
            Awb: AwbAttribute,
            Asrs: AsrsAttribute,
            SkidPlatform: SkidPlatformAttribute,
          },
          relations: {
            Awb: true,
            Asrs: true,
            SkidPlatform: true,
          },
        },
      );

      // 현재 안착대에 어떤 화물이 들어왔는지 파악하기 위한 mqtt 전송 [작업지시 화면에서 필요함]
      this.client
        .send(`hyundai/skidPlatform/insert`, { data: historyResultObject })
        .pipe(take(1))
        .subscribe();
      return historyResult;
    }
  }

  async findAll(query: SkidPlatformHistory & BasicQueryParamDto) {
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
    return await this.skidPlatformHistoryRepository.find({
      select: {
        Awb: AwbAttribute,
        Asrs: AsrsAttribute,
        SkidPlatform: SkidPlatformAttribute,
        AsrsOutOrder: {
          ...AsrsOutOrderAttribute,
          Awb: AwbAttribute,
          Asrs: AsrsAttribute,
          SkidPlatform: SkidPlatformAttribute,
        },
      },
      relations: {
        Awb: true,
        Asrs: true,
        SkidPlatform: true,
        AsrsOutOrder: {
          Awb: true,
          Asrs: true,
          SkidPlatform: true,
        },
      },
      where: {
        // join 되는 테이블들의 FK를 typeorm 옵션에 맞추기위한 조정하기 위한 과정
        Asrs: query.Asrs ? Equal(+query.Asrs) : undefined,
        Awb: query.Awb ? Equal(+query.Awb) : undefined,
        SkidPlatform: query.SkidPlatform
          ? Equal(+query.SkidPlatform)
          : undefined,
        AsrsOutOrder: query.AsrsOutOrder
          ? Equal(+query.AsrsOutOrder)
          : undefined,
        createdAt: findDate,
      },
    });
  }

  async findOne(id: number) {
    const result = await this.skidPlatformHistoryRepository.findOne({
      where: { id: id },
      select: {
        Awb: AwbAttribute,
        Asrs: AsrsAttribute,
        SkidPlatform: SkidPlatformAttribute,
        AsrsOutOrder: {
          ...AsrsOutOrderAttribute,
          Awb: AwbAttribute,
          Asrs: AsrsAttribute,
          SkidPlatform: SkidPlatformAttribute,
        },
      },
      relations: {
        Awb: true,
        Asrs: true,
        SkidPlatform: true,
        AsrsOutOrder: {
          Awb: true,
          Asrs: true,
          SkidPlatform: true,
        },
      },
    });
    return result;
  }

  /**
   * 안착대 이력에서 skid_platform_id를 기준으로 최신 안착대의 상태만 가져옴
   */
  async nowState() {
    const skidPlatfromState = await this.skidPlatformHistoryRepository
      .createQueryBuilder('sph')
      .distinctOn(['sph.skid_platform_id'])
      .leftJoinAndSelect('sph.SkidPlatform', 'SkidPlatform')
      .leftJoinAndSelect('sph.Asrs', 'Asrs')
      .leftJoinAndSelect('sph.Awb', 'Awb')
      .leftJoinAndSelect('Awb.Scc', 'Scc') // awb의 Scc를 반환합니다.
      // .where('sph.inOutType = :type', { type: 'in' })
      .orderBy('sph.skid_platform_id')
      .addOrderBy('sph.id', 'DESC')
      .getMany(); // 또는 getMany()를 사용하여 엔터티로 결과를 가져올 수 있습니다.
    return skidPlatfromState.filter((v) => v.inOutType === 'in');
  }

  /**
   * 안착대 이력에서 asrs_id를 기준으로 최신 안착대의 'in' 상태인거 모두 삭제
   */
  async resetAsrs() {
    const skidPlatfromState = await this.skidPlatformHistoryRepository
      .createQueryBuilder('sph')
      .distinctOn(['sph.skid_platform_id'])
      .leftJoinAndSelect('sph.SkidPlatform', 'SkidPlatform')
      .leftJoinAndSelect('sph.Asrs', 'Asrs')
      .leftJoinAndSelect('sph.Awb', 'Awb')
      .leftJoinAndSelect('Awb.Scc', 'Scc') // awb의 Scc를 반환합니다.
      // .where('sph.inOutType = :type', { type: 'in' })
      .orderBy('sph.skid_platform_id')
      .addOrderBy('sph.id', 'DESC')
      .getMany(); // 또는 getMany()를 사용하여 엔터티로 결과를 가져올 수 있습니다.

    const skidPlatformIds = skidPlatfromState.map(
      (skidPlatformHistory) =>
        (skidPlatformHistory.SkidPlatform as SkidPlatform).id,
    );
    const awbIds = skidPlatfromState.map(
      (skidPlatformHistory) => (skidPlatformHistory.Awb as Awb).id,
    );
    if (
      skidPlatformIds &&
      skidPlatformIds.length > 0 &&
      awbIds &&
      awbIds.length > 0
    ) {
      const deleteResult = await this.skidPlatformHistoryRepository
        .createQueryBuilder()
        .delete()
        .where('SkidPlatform IN (:...skidPlatformIds)', { skidPlatformIds })
        .andWhere('Awb IN (:...awbIds)', { awbIds })
        .execute();
      return deleteResult;
    }
    return '안착대가 비었습니다.';
  }

  update(
    id: number,
    updateSkidPlatformHistoryDto: UpdateSkidPlatformHistoryDto,
  ) {
    return this.skidPlatformHistoryRepository.update(
      id,
      updateSkidPlatformHistoryDto as SkidPlatformHistory,
    );
  }

  remove(id: number) {
    return this.skidPlatformHistoryRepository.delete(id);
  }

  // plc의 데이터중 안착대 화물정보가 변경되었을 때 안착대 이력을 등록하기 위함입니다.
  async checkSkidPlatformChange(body: CreateSkidPlatformAndAsrsPlcDto) {}
}
