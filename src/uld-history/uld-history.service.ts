import { Inject, Injectable } from '@nestjs/common';
import { CreateUldHistoryDto } from './dto/create-uld-history.dto';
import { UpdateUldHistoryDto } from './dto/update-uld-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  Equal,
  FindOperator,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { UldHistory } from './entities/uld-history.entity';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { AwbAttribute } from '../awb/entities/awb.entity';
import { SkidPlatformAttribute } from '../skid-platform/entities/skid-platform.entity';
import { Uld, UldAttribute } from '../uld/entities/uld.entity';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UldHistoryService {
  constructor(
    @InjectRepository(UldHistory)
    private readonly uldHistoryRepository: Repository<UldHistory>,
    @InjectRepository(Uld)
    private readonly uldRepository: Repository<Uld>,
    @Inject('MQTT_SERVICE') private client: ClientProxy,
  ) {}
  async create(createUldHistoryDto: CreateUldHistoryDto) {
    const result = await this.uldHistoryRepository.create(createUldHistoryDto);

    const insertResult = await this.uldHistoryRepository.save(result);
    // 현재 안착대에 어떤 화물이 들어왔는지 파악하기 위한 mqtt 전송 [작업지시 화면에서 필요함]
    this.client.send(`hyundai/uldHistory/insert`, insertResult).subscribe();
    return result;
  }

  async findAll(query: UldHistory & BasicQueryParamDto) {
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
    return await this.uldHistoryRepository.find({
      select: {
        // BuildUpOrder: {
        //   ...BuildUpOrderAttribute,
        //   SkidPlatform: SkidPlatformAttribute,
        //   Uld: UldAttribute,
        //   Awb: AwbAttribute,
        // },
        // buildUpOrder에 중복되는 내용이라 생략
        SkidPlatform: SkidPlatformAttribute,
        Uld: UldAttribute,
        Awb: AwbAttribute,
      },
      relations: {
        // BuildUpOrder: {
        //   SkidPlatform: true,
        //   Uld: true,
        //   Awb: true,
        // },
        SkidPlatform: true,
        Uld: true,
        Awb: true,
      },
      where: {
        // join 되는 테이블들의 FK를 typeorm 옵션에 맞추기위한 조정하기 위한 과정
        // BuildUpOrder: query.BuildUpOrder
        //   ? Equal(+query.BuildUpOrder)
        //   : undefined,
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
    const result = await this.uldHistoryRepository.findOne({
      where: { id: id },
    });
    return result;
  }

  /**
   * uld 이력에서 uld_id를 기준으로 최신 안착대의 상태만 가져옴
   */
  async nowState(uldCode: string) {
    const targetUld = await this.uldRepository.findOne({
      where: { code: uldCode },
    });
    const uldHistory = await this.uldHistoryRepository
      .createQueryBuilder('uh')
      .leftJoinAndSelect('uh.Awb', 'Awb')
      .leftJoinAndSelect('Awb.Scc', 'Scc')
      .where('uh.Uld = :uldId', { uldId: targetUld.id })
      .getMany();

    return uldHistory;
  }

  update(id: number, updateUldHistoryDto: UpdateUldHistoryDto) {
    return this.uldHistoryRepository.update(id, updateUldHistoryDto);
  }

  remove(id: number) {
    return this.uldHistoryRepository.delete(id);
  }
}
