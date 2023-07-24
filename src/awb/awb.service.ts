import { HttpException, Injectable } from '@nestjs/common';
import { CreateAwbDto } from './dto/create-awb.dto';
import { UpdateAwbDto } from './dto/update-awb.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, TypeORMError } from 'typeorm';
import { Awb } from './entities/awb.entity';
import { AwbSccJoin } from '../awb-scc-join/entities/awb-scc-join.entity';
import { CreateAwbSccJoinDto } from '../awb-scc-join/dto/create-awb-scc-join.dto';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { Scc } from '../scc/entities/scc.entity';

@Injectable()
export class AwbService {
  constructor(
    @InjectRepository(Awb)
    private readonly awbRepository: Repository<Awb>,
    @InjectRepository(AwbSccJoin)
    private readonly cargoSccJoinRepository: Repository<AwbSccJoin>,
    private dataSource: DataSource,
  ) {}

  async create(createCargoDto: CreateAwbDto) {
    const { scc, ...cargoDto } = createCargoDto;

    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await queryRunner.manager
        .getRepository(Awb)
        .save(cargoDto);

      const sccResult = await queryRunner.manager.getRepository(Scc).save(scc);

      const joinParams: CreateAwbSccJoinDto = {
        scc: sccResult.id,
        cargo: result,
      };
      await queryRunner.manager.getRepository(AwbSccJoin).save(joinParams);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new TypeORMError(`rollback Working - ${error}`);
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return this.awbRepository.find();
  }

  findFamily(id: number) {
    return this.awbRepository.find({ where: [{ id: id }, { parent: id }] });
  }

  findOne(id: number) {
    return this.awbRepository.find({ where: { id: id } });
  }

  update(id: number, updateCargoDto: UpdateAwbDto) {
    return this.awbRepository.update(id, updateCargoDto);
  }

  updateState(id: number, state: string, updateCargoDto?: UpdateAwbDto) {
    if (state) updateCargoDto.state = state;
    return this.awbRepository.update(id, updateCargoDto);
  }

  async breakDown(parentName: string, createCargoDtoArray: CreateAwbDto[]) {
    const parentCargo = await this.awbRepository.findOne({
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
          .getRepository(Awb)
          .save(subCargo);

        const joinParams: CreateAwbSccJoinDto = {
          scc: createCargoDtoArray[i].scc,
          cargo: result,
        };
        // 2-2. scc join에 등록
        await queryRunner.manager.getRepository(AwbSccJoin).save(joinParams);
      }

      // 2-3. 부모 화물 breakDown:True로 상태 변경
      await queryRunner.manager
        .getRepository(Awb)
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
    return this.awbRepository.delete(id);
  }

  async modelingComplete(id: number, file: Express.Multer.File) {
    // parameter에 있는 awb 정보에 모델링파일을 연결합니다.
    await this.awbRepository.update(id, { path: file.path });
  }
}
