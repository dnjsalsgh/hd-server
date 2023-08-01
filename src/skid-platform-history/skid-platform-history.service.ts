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
import { BasicQueryParam } from '../lib/dto/basicQueryParam';

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

  async findAll(query: SkidPlatformHistory & BasicQueryParam) {
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
    });
    return result;
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
    const awbId = awbInfo.awbId;

    // 어떤 창고에서 나왔는지
    const asrsId = +body.LH_ASRS_ID || +body.RH_ASRS_ID;

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
    };

    this.skidPlatformHistoryRepository.save(skidPlatformHistoryBody);
  }
}
