import { HttpException, Injectable } from '@nestjs/common';
import { CreateCargoDto } from './dto/create-cargo.dto';
import { UpdateCargoDto } from './dto/update-cargo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, TypeORMError } from 'typeorm';
import { Cargo } from './entities/cargo.entity';
import { CargoSccJoin } from '../cargo-scc-join/entities/cargo-scc-join.entity';
import { CreateCargoSccJoinDto } from '../cargo-scc-join/dto/create-cargo-scc-join.dto';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

@Injectable()
export class CargoService {
  constructor(
    @InjectRepository(Cargo)
    private readonly cargoRepository: Repository<Cargo>,
    @InjectRepository(CargoSccJoin)
    private readonly cargoSccJoinRepository: Repository<CargoSccJoin>,
    private dataSource: DataSource,
  ) {}

  async create(createCargoDto: CreateCargoDto) {
    const { scc, ...cargoDto } = createCargoDto;

    const queryRunner = await this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const result = await queryRunner.manager
        .getRepository(Cargo)
        .save(cargoDto);

      const joinParams: CreateCargoSccJoinDto = {
        scc: scc,
        cargo: result,
      };
      await queryRunner.manager.getRepository(CargoSccJoin).save(joinParams);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new TypeORMError(`rollback Working - ${error}`);
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return this.cargoRepository.find();
  }

  findOne(id: number) {
    return this.cargoRepository.find({ where: { id: id } });
  }

  update(id: number, updateCargoDto: UpdateCargoDto) {
    return this.cargoRepository.update(id, updateCargoDto);
  }

  remove(id: number) {
    return this.cargoRepository.delete(id);
  }
}
