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

  findFamily(id: number) {
    return this.cargoRepository.find({ where: [{ id: id }, { parent: id }] });
  }

  findOne(id: number) {
    return this.cargoRepository.find({ where: { id: id } });
  }

  update(id: number, updateCargoDto: UpdateCargoDto) {
    return this.cargoRepository.update(id, updateCargoDto);
  }

  async breakDown(parentName: string, createCargoDtoArray: CreateCargoDto[]) {
    const parentCargo = await this.cargoRepository.findOne({
      where: { name: parentName },
    });
    // 1. 부모의 존재, 부모의 parent 칼럼이 0인지, 해포여부가 false인지 확인
    if (
      !parentCargo &&
      parentCargo.parent !== 0 &&
      parentCargo.breakDown === false
    ) {
      throw new HttpException('상위 화물 정보가 잘못되었습니다.', 400);
    }

    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 2. 해포된 화물들 등록
      for (let i = 0; i < createCargoDtoArray.length; i++) {
        // 2-1. 하위 화물 등록
        const subCargo = createCargoDtoArray[i];
        subCargo.parent = parentCargo.id;

        const result = await queryRunner.manager
          .getRepository(Cargo)
          .save(subCargo);

        const joinParams: CreateCargoSccJoinDto = {
          scc: createCargoDtoArray[i].scc,
          cargo: result,
        };
        // 2-2. scc join에 등록
        await queryRunner.manager.getRepository(CargoSccJoin).save(joinParams);
      }

      // 2-3. 부모 화물 breakDown:True로 상태 변경
      await queryRunner.manager
        .getRepository(Cargo)
        .update({ name: parentName }, { breakDown: true });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new TypeORMError(`rollback Working - ${error}`);
    } finally {
      await queryRunner.release();
    }
  }

  remove(id: number) {
    return this.cargoRepository.delete(id);
  }
}
