import { Inject, Injectable } from '@nestjs/common';
import { CreateAircraftScheduleDto } from './dto/create-aircraft-schedule.dto';
import { UpdateAircraftScheduleDto } from './dto/update-aircraft-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AircraftSchedule } from './entities/aircraft-schedule.entity';
import {
  Between,
  DataSource,
  Equal,
  FindOperator,
  ILike,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
  TypeORMError,
} from 'typeorm';
import {
  Aircraft,
  AircraftAttribute,
} from '../aircraft/entities/aircraft.entity';
import {
  CcIdDestinationAttribute,
  CommonCode,
} from '../common-code/entities/common-code.entity';
import { orderByUtil } from '../lib/util/orderBy.util';
import { Awb, AwbAttribute } from '../awb/entities/awb.entity';
import { ClientProxy } from '@nestjs/microservices';
import { take } from 'rxjs';
import { CreateAircraftScheduleByNameDto } from './dto/create-aircraft-schedule-by-name.dto';
import { AwbSccJoin } from '../awb-scc-join/entities/awb-scc-join.entity';
import { CreateCommonCodeDto } from '../common-code/dto/create-common-code.dto';
import { CreateAircraftDto } from '../aircraft/dto/create-aircraft.dto';
import { Uld } from '../uld/entities/uld.entity';

@Injectable()
export class AircraftScheduleService {
  constructor(
    @InjectRepository(AircraftSchedule)
    private readonly aircraftScheduleRepository: Repository<AircraftSchedule>,
    @InjectRepository(Awb)
    private readonly awbRepository: Repository<Awb>,
    @Inject('MQTT_SERVICE') private client: ClientProxy,
    private dataSource: DataSource,
  ) {}

  create(createAircraftScheduleDto: CreateAircraftScheduleDto) {
    return this.aircraftScheduleRepository.save(createAircraftScheduleDto);
  }

  async createByName(
    createAircraftScheduleDto: CreateAircraftScheduleByNameDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 출발지 입력
      const departureCommonCodeBody: CreateCommonCodeDto = {
        name: createAircraftScheduleDto.CcIdDeparture,
        code: createAircraftScheduleDto.CcIdDeparture,
        masterCode: 'route',
      };
      const departureCommonCodeResult = await queryRunner.manager
        .getRepository(CommonCode)
        .upsert(departureCommonCodeBody, ['code']);

      // 2. 목적지 입력
      const destinationCommonCodeBody: CreateCommonCodeDto = {
        name: createAircraftScheduleDto.CcIdDestination,
        code: createAircraftScheduleDto.CcIdDestination,
        masterCode: 'route',
      };
      const destinationCommonCodeResult = await queryRunner.manager
        .getRepository(CommonCode)
        .upsert(destinationCommonCodeBody, ['code']);

      // 3. 항공편 입력
      const aircraftBody: CreateAircraftDto = {
        name: createAircraftScheduleDto.name,
        code: createAircraftScheduleDto.code,
        info: createAircraftScheduleDto.info,
        allow: createAircraftScheduleDto.allow,
        allowDryIce: createAircraftScheduleDto.allowDryIce,
      };
      const aircraftResult = await queryRunner.manager
        .getRepository(Aircraft)
        .upsert(aircraftBody, ['name']);

      // 4. Uld 입력(항공편 안에 있는 uld 입력)
      const UldsInAircraftShedule = createAircraftScheduleDto.Ulds;
      const uldBodys: Uld[] = [];
      for (const uld of UldsInAircraftShedule) {
        uldBodys.push(uld);
      }
      await queryRunner.manager.getRepository(Uld).save(uldBodys);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new TypeORMError(`rollback Working - ${error}`);
    } finally {
      await queryRunner.release();
    }

    // return this.aircraftScheduleRepository.save(createAircraftScheduleDto);
  }

  async createWithAwbs(createAircraftScheduleDto: CreateAircraftScheduleDto) {
    const { Awbs, ...aircraftSchedule } = createAircraftScheduleDto;

    const aircraftScheduleResult = await this.aircraftScheduleRepository.save(
      createAircraftScheduleDto,
    );

    for (const awb of Awbs) {
      awb.AirCraftSchedule = aircraftScheduleResult.id;
      const awbsResult = this.awbRepository.save(awb);
    }
    const insertResult = await this.aircraftScheduleRepository.save(
      createAircraftScheduleDto,
    );
    this.client
      .send(`hyundai/aircraftSchedule/insert`, insertResult)
      .subscribe();
    return insertResult;
  }

  async findAll(
    Aircraft: number,
    CcIdDestination: number,
    CcIdDeparture: number,
    source?: string,
    createdAtFrom?: Date,
    createdAtTo?: Date,
    order?: string,
    limit?: number,
    offset?: number,
  ) {
    let findDate: FindOperator<Date>;
    if (createdAtFrom && createdAtTo) {
      findDate = Between(createdAtFrom, createdAtTo);
    } else if (createdAtFrom) {
      findDate = MoreThanOrEqual(createdAtFrom);
    } else if (createdAtTo) {
      findDate = LessThanOrEqual(createdAtTo);
    }

    const result = await this.aircraftScheduleRepository.find({
      relations: {
        Aircraft: true,
        CcIdDestination: true,
        CcIdDeparture: true,
        Awbs: true,
      },
      select: {
        Aircraft: AircraftAttribute,
        CcIdDestination: CcIdDestinationAttribute,
        CcIdDeparture: CcIdDestinationAttribute,
        Awbs: AwbAttribute,
      },
      where: {
        source: source ? ILike(`%${source}%`) : undefined,
        Aircraft: Aircraft ? Equal(+Aircraft) : undefined,
        CcIdDestination: CcIdDestination ? Equal(+CcIdDestination) : undefined,
        CcIdDeparture: CcIdDeparture ? Equal(+CcIdDeparture) : undefined,
        createdAt: findDate,
      },
      order: orderByUtil(order),
      take: limit, // limit
      skip: offset, // offset
      cache: 60000, // 1 minute caching
    });

    this.client.send(`hyundai/aircraftSchedule/find`, result).subscribe();

    return result;
  }

  async findOne(id: number) {
    const result = await this.aircraftScheduleRepository.find({
      where: { id: id },
      relations: {
        Aircraft: true,
        CcIdDestination: true,
        CcIdDeparture: true,
        Awbs: true,
      },
      select: {
        Aircraft: AircraftAttribute,
        CcIdDestination: CcIdDestinationAttribute,
        CcIdDeparture: CcIdDestinationAttribute,
        Awbs: AwbAttribute,
      },
    });
    this.client.send(`hyundai/aircraftSchedule/find`, result).subscribe();
    return result;
  }

  async update(
    id: number,
    updateAircraftScheduleDto: UpdateAircraftScheduleDto,
  ) {
    const { source, Aircraft, CcIdDestination } = updateAircraftScheduleDto;
    await this.aircraftScheduleRepository.update(id, {
      source,
      Aircraft,
      CcIdDestination,
    });
    return;
  }

  async remove(id: number) {
    return await this.aircraftScheduleRepository.delete(id);
  }
}
