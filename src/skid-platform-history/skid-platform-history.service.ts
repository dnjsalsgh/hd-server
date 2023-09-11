import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSkidPlatformHistoryDto } from './dto/create-skid-platform-history.dto';
import { UpdateSkidPlatformHistoryDto } from './dto/update-skid-platform-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  Equal,
  FindOperator,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { SkidPlatformHistory } from './entities/skid-platform-history.entity';
import { AwbAttribute } from '../awb/entities/awb.entity';
import { AsrsAttribute } from '../asrs/entities/asrs.entity';
import { SkidPlatformAttribute } from '../skid-platform/entities/skid-platform.entity';
import {
  AsrsOutOrder,
  AsrsOutOrderAttribute,
} from '../asrs-out-order/entities/asrs-out-order.entity';
import { CreateSkidPlatformAndAsrsPlcDto } from './dto/plc-data-intersection.dto';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { orderByUtil } from '../lib/util/orderBy.util';

@Injectable()
export class SkidPlatformHistoryService {
  constructor(
    @InjectRepository(SkidPlatformHistory)
    private readonly skidPlatformHistoryRepository: Repository<SkidPlatformHistory>,
    @InjectRepository(AsrsOutOrder)
    private readonly asrsOutOrderRepository: Repository<AsrsOutOrder>,
  ) {}
  async create(createSkidPlatformHistoryDto: CreateSkidPlatformHistoryDto) {
    const asrs = await this.skidPlatformHistoryRepository.create(
      createSkidPlatformHistoryDto,
    );

    await this.skidPlatformHistoryRepository.save(asrs);
    return asrs;
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
    return this.skidPlatformHistoryRepository
      .createQueryBuilder('sph')
      .distinctOn(['sph.skid_platform_id'])
      .leftJoinAndSelect('sph.SkidPlatform', 'SkidPlatform')
      .leftJoinAndSelect('sph.Asrs', 'Asrs')
      .leftJoinAndSelect('sph.Awb', 'Awb')
      .leftJoinAndSelect('Awb.Scc', 'Scc') // awb의 Scc를 반환합니다.
      .orderBy('sph.skid_platform_id')
      .addOrderBy('sph.id', 'DESC')
      .getMany(); // 또는 getMany()를 사용하여 엔터티로 결과를 가져올 수 있습니다.
  }

  update(
    id: number,
    updateSkidPlatformHistoryDto: UpdateSkidPlatformHistoryDto,
  ) {
    return this.skidPlatformHistoryRepository.update(
      id,
      updateSkidPlatformHistoryDto,
    );
  }

  remove(id: number) {
    return this.skidPlatformHistoryRepository.delete(id);
  }

  // plc의 데이터중 안착대 화물정보가 변경되었을 때 안착대 이력을 등록하기 위함입니다.
  async checkSkidPlatformChange(body: CreateSkidPlatformAndAsrsPlcDto) {
    // 안착대의 정보를 가져오기
    const platInfo =
      (body.Pallet_Rack1_Part_Info as unknown as {
        skidPlatformId: number;
        awbId: number;
      }) ||
      (body.Pallet_Rack2_Part_Info as unknown as {
        skidPlatformId: number;
        awbId: number;
      }) ||
      (body.Pallet_Rack3_Part_Info as unknown as {
        skidPlatformId: number;
        awbId: number;
      }) ||
      (body.Pallet_Rack4_Part_Info as unknown as {
        skidPlatformId: number;
        awbId: number;
      });

    // 어떤 안착대로 가야하는지
    const skidPlatformId = platInfo.skidPlatformId;

    // 어떤 창고에서 나왔는지
    const asrsId = +body.LH_ASRS_ID || +body.RH_ASRS_ID;

    // 어떤 화물인지
    const awbInfo =
      (body.ASRS_LH_Rack1_Part_Info as unknown as {
        awbId: number;
        count: number;
      }) ||
      (body.ASRS_LH_Rack2_Part_Info as unknown as {
        awbId: number;
        count: number;
      }) ||
      (body.ASRS_LH_Rack3_Part_Info as unknown as {
        awbId: number;
        count: number;
      }) ||
      (body.ASRS_LH_Rack4_Part_Info as unknown as {
        awbId: number;
        count: number;
      }) ||
      (body.ASRS_LH_Rack5_Part_Info as unknown as {
        awbId: number;
        count: number;
      }) ||
      (body.ASRS_LH_Rack6_Part_Info as unknown as {
        awbId: number;
        count: number;
      }) ||
      (body.ASRS_LH_Rack7_Part_Info as unknown as {
        awbId: number;
        count: number;
      }) ||
      (body.ASRS_LH_Rack8_Part_Info as unknown as {
        awbId: number;
        count: number;
      }) ||
      (body.ASRS_LH_Rack9_Part_Info as unknown as {
        awbId: number;
        count: number;
      });

    // 화물정보 안에 화물Id 들어왔다고 가정
    const awbId = awbInfo.awbId;
    // 화물정보 안에 화물수량 들어왔다고 가정
    const count = awbInfo.count;
    // 화물이 인입인지 인출인지 확인
    let inOutType = '';
    if (body.Out_Conveyor_Start) {
      // out 컨베이어 밸트가 움직일 때만 안착대에 입고되었다고 판단
      inOutType = 'in';
    } else {
      inOutType = 'out';
    }

    //TODO 어느 창고에서 왔는지, 어떤 화물인지를 추적해서 작업지시를 가져옵니다.
    const asrsOutOrderResult = await this.asrsOutOrderRepository.findOne({
      where: { Asrs: asrsId, Awb: awbId },
      order: { id: 'desc' },
    });

    if (!asrsOutOrderResult)
      throw new NotFoundException('자동창고 작업지시를 찾지 못했습니다.');

    const skidPlatformHistoryBody: CreateSkidPlatformHistoryDto = {
      AsrsOutOrder: asrsOutOrderResult.id,
      Asrs: asrsId,
      SkidPlatform: skidPlatformId,
      Awb: awbId,
      inOutType: inOutType,
      count: count,
    };

    // 입고, 출고에 따른 값 계산
    const topLevelHistory = await this.skidPlatformHistoryRepository.findOne({
      where: { Awb: awbId, Asrs: asrsId },
      order: { createdAt: 'desc' },
    });
    if (skidPlatformHistoryBody.inOutType === 'in')
      skidPlatformHistoryBody.count += topLevelHistory.count;
    else if (skidPlatformHistoryBody.inOutType === 'out')
      skidPlatformHistoryBody.count =
        topLevelHistory.count - skidPlatformHistoryBody.count;

    await this.skidPlatformHistoryRepository.save(skidPlatformHistoryBody);
  }
}
