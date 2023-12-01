import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  Equal,
  FindOperator,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { CreateAsrsOutOrderDto } from './dto/create-asrs-out-order.dto';
import { AsrsOutOrder } from './entities/asrs-out-order.entity';
import { UpdateAsrsOutOrderDto } from './dto/update-asrs-out-order.dto';
import { Asrs, AsrsAttribute } from '../asrs/entities/asrs.entity';
import { SkidPlatformAttribute } from '../skid-platform/entities/skid-platform.entity';
import { Awb, AwbAttribute } from '../awb/entities/awb.entity';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { ClientProxy } from '@nestjs/microservices';
import { take } from 'rxjs';
import { UldAttribute } from '../uld/entities/uld.entity';
import { orderByUtil } from '../lib/util/orderBy.util';

@Injectable()
export class AsrsOutOrderService {
  constructor(
    @InjectRepository(AsrsOutOrder)
    private readonly asrsOutOrderRepository: Repository<AsrsOutOrder>,
    @Inject('MQTT_SERVICE') private client: ClientProxy,
  ) {}
  async create(
    createAsrsOutOrderDto: CreateAsrsOutOrderDto,
  ): Promise<AsrsOutOrder> {
    const asrs = await this.asrsOutOrderRepository.create(
      createAsrsOutOrderDto,
    );
    // amr실시간 데이터 mqtt로 publish 하기 위함
    this.client
      .send(`hyundai/asrs1/outOrder`, {
        asrs: asrs,
        time: new Date().toISOString(),
      })
      .pipe(take(1))
      .subscribe();
    await this.asrsOutOrderRepository.save(asrs);
    return asrs;
  }

  async manualChange(createAsrsOutOrderDtoList: CreateAsrsOutOrderDto[]) {
    const asrs = await this.asrsOutOrderRepository.create(
      createAsrsOutOrderDtoList,
    );
    // amr실시간 데이터 mqtt로 publish 하기 위함
    this.client
      .send(`hyundai/asrs1/outOrder`, {
        asrs: asrs,
        time: new Date().toISOString(),
      })
      .pipe(take(1))
      .subscribe();
    await this.asrsOutOrderRepository.save(asrs);
    // return asrs;
  }

  async findAll(query: AsrsOutOrder & BasicQueryParamDto) {
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

    return await this.asrsOutOrderRepository.find({
      select: {
        Asrs: AsrsAttribute,
        SkidPlatform: SkidPlatformAttribute,
        Awb: AwbAttribute,
        Uld: UldAttribute,
      },
      relations: {
        Asrs: true,
        SkidPlatform: true,
        Awb: true,
        Uld: true,
      },
      where: {
        // join 되는 테이블들의 FK를 typeorm 옵션에 맞추기위한 조정하기 위한 과정
        Asrs: query.Asrs ? Equal(+query.Asrs) : undefined,
        Awb: query.Awb ? Equal(+query.Awb) : undefined,
        Uld: query.Uld ? Equal(+query.Uld) : undefined,
        SkidPlatform: query.SkidPlatform
          ? Equal(+query.SkidPlatform)
          : undefined,
        createdAt: findDate,
      },
    });
  }

  async findTarget() {
    const asrsOutOrderList = await this.asrsOutOrderRepository.find({
      relations: {
        Asrs: true,
        Awb: true,
      },
      select: {
        Asrs: { id: true, name: true },
        Awb: { id: true, barcode: true },
      },
      order: orderByUtil(null),
      take: 50,
    });

    const mainCreatedTime = asrsOutOrderList[0].createdAt.toISOString();

    const filterdAsrsOutOrder = asrsOutOrderList
      .filter((aoo) => {
        return aoo.createdAt.toISOString() === mainCreatedTime;
      })
      .map((aoo) => {
        return {
          order: aoo.order,
          Asrs: (aoo.Asrs as Asrs).name,
          Awb: (aoo.Awb as Awb).barcode,
        };
      });

    return filterdAsrsOutOrder;
  }

  async findOne(id: number) {
    const result = await this.asrsOutOrderRepository.findOne({
      where: { id: id },
      relations: {
        Asrs: true,
        SkidPlatform: true,
        Awb: true,
      },
      select: {
        Asrs: AsrsAttribute,
        SkidPlatform: SkidPlatformAttribute,
        Awb: AwbAttribute,
      },
    });
    return result;
  }

  update(id: number, updateAsrsOutOrderDto: UpdateAsrsOutOrderDto) {
    return this.asrsOutOrderRepository.update(id, updateAsrsOutOrderDto);
  }

  remove(id: number) {
    return this.asrsOutOrderRepository.delete(id);
  }
}
