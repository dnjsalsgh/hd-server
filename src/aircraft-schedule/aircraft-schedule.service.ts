import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
  TypeORMError,
} from 'typeorm';
import {
  Aircraft,
  AircraftAttribute,
} from '../aircraft/entities/aircraft.entity';
import { orderByUtil } from '../lib/util/orderBy.util';
import { Awb, AwbAttribute } from '../awb/entities/awb.entity';
import { ClientProxy } from '@nestjs/microservices';
import { CreateAircraftScheduleByNameDto } from './dto/create-aircraft-schedule-by-name.dto';
import { CreateAircraftDto } from '../aircraft/dto/create-aircraft.dto';
import { Uld } from '../uld/entities/uld.entity';
import { UldType } from '../uld-type/entities/uld-type.entity';

@Injectable()
export class AircraftScheduleService {
  constructor(
    @InjectRepository(AircraftSchedule)
    private readonly aircraftScheduleRepository: Repository<AircraftSchedule>,
    @InjectRepository(Awb)
    private readonly awbRepository: Repository<Awb>,
    @Inject('MQTT_SERVICE') private client: ClientProxy,
    private dataSource: DataSource,
    @InjectRepository(Uld)
    private readonly uldRepository: Repository<Uld>,
    @InjectRepository(UldType)
    private readonly UldTypeRepository: Repository<UldType>,
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
      // 1. 항공기 입력
      const aircraftBody: CreateAircraftDto = {
        name: createAircraftScheduleDto.name,
        code: createAircraftScheduleDto.code,
        info: createAircraftScheduleDto.info,
        allow: createAircraftScheduleDto.allow,
        allowDryIce: createAircraftScheduleDto.allowDryIce,
      };
      const aircraftResult = await queryRunner.manager
        .getRepository(Aircraft)
        .upsert(aircraftBody, ['code']);

      // 2. Uld 입력(항공편 안에 있는 uld 입력)
      const UldsInAircraftShedule = createAircraftScheduleDto.Ulds;
      if (UldsInAircraftShedule && UldsInAircraftShedule.length > 0) {
        // uld가 있다면 동작하게끔 예외처리
        for (const uld of UldsInAircraftShedule) {
          // uldType 주입
          try {
            const uldTypeCode = uld.UldType as unknown as string;
            const uldTypeResult = await this.UldTypeRepository.findOne({
              where: { code: uldTypeCode },
            });
            uld.UldType = uldTypeResult.id;
          } catch (e) {
            throw new NotFoundException(`uldType not found`);
          }
          await queryRunner.manager.getRepository(Uld).save(uld);
        }
      }

      // 3. 항공편 입력
      const aircraftSchedule: CreateAircraftScheduleDto = {
        source: createAircraftScheduleDto.source,
        localDepartureTime: createAircraftScheduleDto.localDepartureTime,
        koreaArrivalTime: createAircraftScheduleDto.koreaArrivalTime,
        workStartTime: createAircraftScheduleDto.workStartTime,
        workCompleteTargetTime:
          createAircraftScheduleDto.workCompleteTargetTime,
        koreaDepartureTime: createAircraftScheduleDto.koreaDepartureTime,
        localArrivalTime: createAircraftScheduleDto.localArrivalTime,
        waypoint: createAircraftScheduleDto.waypoint,
        Aircraft: aircraftResult.identifiers[0]?.id,
        destination: createAircraftScheduleDto.destination,
        departure: createAircraftScheduleDto.departure,
      };

      const airScheduleResult = await queryRunner.manager
        .getRepository(AircraftSchedule)
        .save(aircraftSchedule);

      await queryRunner.commitTransaction();
      return airScheduleResult;
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
        Awbs: true,
      },
      select: {
        Aircraft: AircraftAttribute,
        Awbs: AwbAttribute,
      },
      where: {
        source: source ? ILike(`%${source}%`) : undefined,
        Aircraft: Aircraft ? Equal(+Aircraft) : undefined,
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
        Awbs: true,
      },
      select: {
        Aircraft: AircraftAttribute,
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
    const { source, Aircraft } = updateAircraftScheduleDto;
    await this.aircraftScheduleRepository.update(id, {
      source,
      Aircraft,
    });
    return;
  }

  async remove(id: number) {
    return await this.aircraftScheduleRepository.delete(id);
  }
}
