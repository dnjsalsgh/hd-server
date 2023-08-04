import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAwbDto } from './dto/create-awb.dto';
import { UpdateAwbDto } from './dto/update-awb.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  DataSource,
  FindOperator,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
  TypeORMError,
} from 'typeorm';
import { Awb } from './entities/awb.entity';
import { AwbSccJoin } from '../awb-scc-join/entities/awb-scc-join.entity';
import { CreateAwbSccJoinDto } from '../awb-scc-join/dto/create-awb-scc-join.dto';
import { Scc } from '../scc/entities/scc.entity';
import { BasicQueryParam } from '../lib/dto/basicQueryParam';
import { getOrderBy } from '../lib/util/getOrderBy';
import { ClientProxy } from '@nestjs/microservices';
import { take } from 'rxjs';

@Injectable()
export class AwbService {
  constructor(
    @InjectRepository(Awb)
    private readonly awbRepository: Repository<Awb>,
    @InjectRepository(AwbSccJoin)
    private readonly awbSccJoinRepository: Repository<AwbSccJoin>,
    @InjectRepository(Scc)
    private readonly sccRepository: Repository<Scc>,
    private dataSource: DataSource,
    @Inject('MQTT_SERVICE') private client: ClientProxy,
  ) {}

  async create(createAwbDto: CreateAwbDto) {
    const { scc, ...awbDto } = createAwbDto;

    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // awb를 입력하기
      const awbResult = await queryRunner.manager
        .getRepository(Awb)
        .save(awbDto);

      // scc를 입력하기(존재한다면 update)
      const sccResult = await queryRunner.manager
        .getRepository(Scc)
        .upsert(scc, ['name']);

      // awb와 scc를 연결해주기 위한 작업
      const joinParam = sccResult.identifiers.map((item) => {
        return {
          Awb: awbResult.id,
          Scc: item.id,
        };
      });

      await queryRunner.manager.getRepository(AwbSccJoin).save(joinParam);

      await queryRunner.commitTransaction();
      // amr실시간 데이터 mqtt로 publish 하기 위함
      this.client
        .send(`hyundai/vms1/readCompl`, {
          amr: awbResult,
          time: new Date().toISOString(),
        })
        .pipe(take(1))
        .subscribe();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new TypeORMError(`rollback Working - ${error}`);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(query: Awb & BasicQueryParam) {
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

    const searchResult = await this.awbRepository.find({
      where: {
        name: query.name ? ILike(`%${query.name}%`) : undefined,
        prefab: query.prefab,
        waterVolume: query.waterVolume,
        squareVolume: query.squareVolume,
        width: query.width,
        length: query.length,
        depth: query.depth,
        weight: query.weight,
        isStructure: query.isStructure,
        barcode: query.barcode,
        destination: query.destination,
        source: query.source,
        breakDown: query.breakDown,
        piece: query.piece,
        state: query.state,
        parent: query.parent,
        modelPath: query.modelPath,
        dataCapacity: query.dataCapacity,
        flight: query.flight,
        from: query.from,
        airportArrival: query.airportArrival,
        path: query.path,
        spawnRatio: query.spawnRatio,
        description: query.description,
        rmComment: query.rmComment,
        localTime: query.localTime,
        localInTerminal: query.localInTerminal,
        simulation: query.simulation,
        createdAt: findDate,
      },
      order: getOrderBy(query.order),
      take: query.limit,
      skip: query.offset,
      relations: {
        Scc: true,
      },
    });
    return searchResult;
  }

  findFamily(id: number) {
    return this.awbRepository.find({
      where: [{ id: id }, { parent: id }],
      relations: {
        Scc: true,
      },
    });
  }

  async findOne(id: number) {
    const searchResult = await this.awbRepository.find({
      where: { id: id },
      relations: {
        Scc: true,
      },
    });
    return searchResult;
  }

  update(id: number, updateCargoDto: UpdateAwbDto) {
    return this.awbRepository.update(id, updateCargoDto);
  }

  updateState(id: number, state: string, updateCargoDto?: UpdateAwbDto) {
    if (state) updateCargoDto.state = state;
    return this.awbRepository.update(id, updateCargoDto);
  }

  async breakDown(parentName: string, createAwbDtos: CreateAwbDto[]) {
    const parentCargo = await this.awbRepository.findOne({
      where: { name: parentName },
    });
    // 1. 부모의 존재, 부모의 parent 칼럼이 0인지, 해포여부가 false인지 확인
    if (
      !parentCargo &&
      parentCargo.parent !== 0 &&
      parentCargo.breakDown === false
    ) {
      throw new NotFoundException('상위 화물 정보가 잘못되었습니다.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 2. 해포된 화물들 등록
      for (let i = 0; i < createAwbDtos.length; i++) {
        // 2-1. 하위 화물 등록
        const subAwb = createAwbDtos[i];
        subAwb.parent = parentCargo.id;

        const awbResult = await queryRunner.manager
          .getRepository(Awb)
          .save(subAwb);

        const sccResult = await queryRunner.manager
          .getRepository(Scc)
          .upsert(subAwb.scc, ['name']);

        // awb와 scc를 연결해주기 위한 작업
        const joinParam = sccResult.identifiers.map((item) => {
          return {
            Awb: awbResult.id,
            Scc: item.id,
          };
        });

        // 2-2. Scc join에 등록
        await queryRunner.manager.getRepository(AwbSccJoin).save(joinParam);
      }

      // 2-3. 부모 화물 breakDown: True로 상태 변경
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
    // parameter에 있는 Awb 정보에 모델링파일을 연결합니다.
    await this.awbRepository.update(id, { path: file.path });
  }
}
