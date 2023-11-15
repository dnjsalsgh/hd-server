import { Inject, Injectable } from '@nestjs/common';
import { CreateUldHistoryDto } from './dto/create-uld-history.dto';
import { UpdateUldHistoryDto } from './dto/update-uld-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  DataSource,
  Equal,
  FindOperator,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { UldHistory } from './entities/uld-history.entity';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { Awb, AwbAttribute } from '../awb/entities/awb.entity';
import { SkidPlatformAttribute } from '../skid-platform/entities/skid-platform.entity';
import { Uld, UldAttribute } from '../uld/entities/uld.entity';
import { ClientProxy } from '@nestjs/microservices';
import { UldService } from '../uld/uld.service';
import { UldSccInjectionDto } from '../uld/dto/uld-sccInjection.dto';

@Injectable()
export class UldHistoryService {
  constructor(
    @InjectRepository(UldHistory)
    private readonly uldHistoryRepository: Repository<UldHistory>,
    @InjectRepository(Uld)
    private readonly uldRepository: Repository<Uld>,
    @Inject('MQTT_SERVICE') private client: ClientProxy,
    private dataSource: DataSource,
    private readonly uldService: UldService,
  ) {}

  async create(createUldHistoryDto: CreateUldHistoryDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    const savedHistory = this.saveHistory(createUldHistoryDto);

    if (createUldHistoryDto.Awb) {
      this.injectScc(createUldHistoryDto, queryRunner);
    }

    this.publishMqttMessage(`hyundai/uldHistory/insert`, savedHistory);

    return savedHistory;
  }

  async saveHistory(createUldHistoryDto) {
    return await this.uldHistoryRepository.save(createUldHistoryDto);
  }

  // uld에 scc를 주입하는 메서드
  async injectScc(createUldHistoryDto, queryRunner) {
    const targetAwbId = +createUldHistoryDto.Awb;
    const targetUldId = +createUldHistoryDto.Uld;
    const sccList = await this.retrieveSccList(queryRunner, targetAwbId);

    if (sccList.length > 0) {
      this.performSccInjection(targetUldId, sccList);
    }
  }

  // Awb에 scc가 있는지 검색하는 메서드
  async retrieveSccList(queryRunner, targetAwbId) {
    const sccList = await this.findSccInAwb(queryRunner, targetAwbId);
    if (sccList.Scc.length > 0) {
      return sccList.Scc.map((v) => v.id);
    } else {
      console.error('scc가 존재하지 않습니다.');
      return [];
    }
  }

  // 실제로 uld에 scc를 넣는 로직
  async performSccInjection(targetUldId, sccList) {
    const sccInjectionDto: UldSccInjectionDto = { Scc: sccList };
    await this.uldService.injectionScc(targetUldId, sccInjectionDto);
  }

  // mqtt 메세지 발행 로직
  publishMqttMessage(topic, message) {
    this.client.send(topic, message).subscribe();
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
        SkidPlatform: SkidPlatformAttribute,
        Uld: UldAttribute,
        Awb: AwbAttribute,
      },
      relations: {
        SkidPlatform: true,
        Uld: true,
        Awb: true,
      },
      where: {
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

  // uld 이력에서 uld_id를 기준으로 최신 안착대의 상태만 가져옴
  async nowState(uldCode: string) {
    const targetUld = await this.uldRepository.findOne({
      where: { code: uldCode },
    });
    const uldHistory = await this.uldHistoryRepository
      .createQueryBuilder('uh')
      .leftJoinAndSelect('uh.Awb', 'Awb')
      .leftJoinAndSelect('Awb.Scc', 'Scc')
      .where('uh.Uld = :uldId', { uldId: targetUld.id })
      .orderBy('uh.id', 'ASC')
      .getMany();

    return uldHistory;
  }

  update(id: number, updateUldHistoryDto: UpdateUldHistoryDto) {
    return this.uldHistoryRepository.update(id, updateUldHistoryDto);
  }

  remove(id: number) {
    return this.uldHistoryRepository.delete(id);
  }

  async findSccInAwb(queryRunner, awbId: number): Promise<Awb> {
    const [searchResult] = await queryRunner.manager.getRepository(Awb).find({
      where: { id: awbId },
      relations: {
        Scc: true,
      },
    });

    return searchResult;
  }
}
