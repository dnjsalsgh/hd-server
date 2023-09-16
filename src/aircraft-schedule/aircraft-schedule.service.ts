import { Injectable } from '@nestjs/common';
import { CreateAircraftScheduleDto } from './dto/create-aircraft-schedule.dto';
import { UpdateAircraftScheduleDto } from './dto/update-aircraft-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AircraftSchedule } from './entities/aircraft-schedule.entity';
import {
  Between,
  Equal,
  FindOperator,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { AircraftAttribute } from '../aircraft/entities/aircraft.entity';
import { CcIdDestinationAttribute } from '../common-code/entities/common-code.entity';
import { orderByUtil } from '../lib/util/orderBy.util';
import { Awb, AwbAttribute } from '../awb/entities/awb.entity';

@Injectable()
export class AircraftScheduleService {
  constructor(
    @InjectRepository(AircraftSchedule)
    private readonly aircraftScheduleRepository: Repository<AircraftSchedule>,
    @InjectRepository(Awb)
    private readonly awbRepository: Repository<Awb>,
  ) {}

  create(createAircraftScheduleDto: CreateAircraftScheduleDto) {
    return this.aircraftScheduleRepository.save(createAircraftScheduleDto);
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

    return this.aircraftScheduleRepository.save(createAircraftScheduleDto);
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

    return result;
  }

  async findOne(id: number) {
    return await this.aircraftScheduleRepository.find({
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
