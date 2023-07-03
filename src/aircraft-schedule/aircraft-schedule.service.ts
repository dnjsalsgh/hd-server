import { Injectable } from '@nestjs/common';
import { CreateAircraftScheduleDto } from './dto/create-aircraft-schedule.dto';
import { UpdateAircraftScheduleDto } from './dto/update-aircraft-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AircraftSchedule } from './entities/aircraft-schedule.entity';
import {
  Between,
  FindOperator,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { AircraftAttribute } from '../aircraft/entities/aircraft.entity';
import { CcIdDestinationAttribute } from '../common-code/entities/common-code.entity';

@Injectable()
export class AircraftScheduleService {
  constructor(
    @InjectRepository(AircraftSchedule)
    private readonly aircraftScheduleRepository: Repository<AircraftSchedule>,
  ) {}

  create(createAircraftScheduleDto: CreateAircraftScheduleDto) {
    // createAircraftScheduleDto.code = new Date().getTime().toString();
    return this.aircraftScheduleRepository.save(createAircraftScheduleDto);
  }

  async findAll(
    source: string,
    createdAtFrom: Date,
    createdAtTo: Date,
    order: string,
    limit: number,
    offset: number,
  ) {
    const conditions: {
      where?: FindOperator<AircraftSchedule>;
      // limit?: number;
      // offset?: number;
      // order?: string;
    } = {};
    const whereCondition: any = {};
    if (createdAtFrom && createdAtTo) {
      whereCondition.createdAt = MoreThanOrEqual(createdAtFrom);
    } else if (createdAtFrom) {
      whereCondition.createdAt = LessThanOrEqual(createdAtTo);
    } else if (createdAtTo) {
      whereCondition.createdAt = Between(createdAtFrom, createdAtTo);
    }

    // if (createdAtFrom) {
    //   conditions.where = {
    //     ...conditions.where,
    //     ...MoreThanOrEqual(createdAtFrom),
    //   };
    // }
    // if (createdAtTo) {
    //   conditions.where = {
    //     ...conditions.where,
    //     ...LessThanOrEqual(createdAtTo),
    //   };
    // }
    //
    // if (createdAtFrom && createdAtTo) {
    //   conditions.where = {
    //     ...conditions.where,
    //     ...Between(createdAtFrom, createdAtTo),
    //   };
    // }

    // const mainEntity = 'aircraftSchedule';
    // const queryBuilder = await this.aircraftScheduleRepository
    //   .createQueryBuilder(`${mainEntity}`)
    //   .leftJoinAndSelect(`${mainEntity}.Aircraft`, 'aircraft')
    //   .select([`${mainEntity}`, ...AircraftAttribute]);
    const result = await this.aircraftScheduleRepository.find({
      relations: {
        Aircraft: true,
        CcIdDestination: true,
      },
      select: {
        // ...makeAttribute(),
        Aircraft: {
          // ...makeAttribute(new Aircraft()),
          ...AircraftAttribute,
        },
        CcIdDestination: {
          // ...makeAttribute(new CommonCode()),
          ...CcIdDestinationAttribute,
        },
      },
      where: {
        createdAt: whereCondition,
      },
      // ...conditions,
    });
    // if (source) {
    //   // queryBuilder.andWhere('aircraftSchedule.source = :source', {
    //   queryBuilder.andWhere(`${mainEntity}.source like :source`, {
    //     source: `%${source}%`,
    //   });
    // }

    // 기간 검색
    // if (createdAtFrom && createdAtTo) {
    //   queryBuilder.andWhere(
    //     `${mainEntity}.createdAt BETWEEN :createdAtFrom AND :createdAtTo`,
    //     { createdAtFrom, createdAtEnd: createdAtTo },
    //   );
    // } else if (createdAtFrom) {
    //   queryBuilder.andWhere(`${mainEntity}.createdAt >= :createdAtFrom`, {
    //     createdAtFrom,
    //   });
    // } else if (createdAtTo) {
    //   queryBuilder.andWhere(`${mainEntity}.createdAt <= :createdAtTo`, {
    //     createdAtEnd: createdAtTo,
    //   });
    // }
    //
    // // -id, -code
    // if (order) queryBuilder.orderBy(`${mainEntity}.${order}`, 'DESC');
    // if (limit) queryBuilder.limit(limit);
    // if (offset) queryBuilder.offset(offset);
    // const result = await queryBuilder.getMany();

    return result;
  }

  async findOne(id: number) {
    return await this.aircraftScheduleRepository.find({
      where: { id: id },
      relations: {
        Aircraft: true,
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
