import { HttpException, Injectable } from '@nestjs/common';
import { CreateAsrsDto } from './dto/create-asrs.dto';
import { UpdateAsrsDto } from './dto/update-asrs.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Asrs } from './entities/asrs.entity';
import { DataSource, Like, Repository, TypeORMError } from 'typeorm';
import { ResponseDto } from '../lib/dto/response.dto';
import { CreateAsrsHistoryDto } from '../asrs-history/dto/create-asrs-history.dto';
import { Awb } from '../awb/entities/awb.entity';
import { AsrsHistory } from '../asrs-history/entities/asrs-history.entity';
import { CreateAsrsPlcDto } from './dto/create-asrs-plc.dto';
import { print } from '../lib/util/consolelog.convert';
import { SkidPlatform } from '../skid-platform/entities/skid-platform.entity';
import { SkidPlatformHistory } from '../skid-platform-history/entities/skid-platform-history.entity';
import { CreateSkidPlatformHistoryDto } from '../skid-platform-history/dto/create-skid-platform-history.dto';

@Injectable()
export class AsrsService {
  constructor(
    @InjectRepository(Asrs)
    private readonly asrsRepository: Repository<Asrs>,
    @InjectRepository(AsrsHistory)
    private readonly asrsHistoryRepository: Repository<AsrsHistory>,

    private dataSource: DataSource,
  ) {}
  async create(createAsrsDto: CreateAsrsDto): Promise<Asrs> {
    let parentAsrs;
    let parentFullPath = '';

    // 부모 정보가 들어올 시
    if (createAsrsDto.parent > 0) {
      parentAsrs = await this.asrsRepository.findOne({
        where: {
          id: createAsrsDto.parent,
        },
      });

      // 부모정보가 없다면 throw
      if (!parentAsrs)
        throw new HttpException('asrs의 부모 정보가 없습니다.', 400);

      // 부모 level + 1
      createAsrsDto.level = parentAsrs.level + 1;

      parentFullPath = parentAsrs.fullPath;
    }

    // fullPath 설정 [부모fullPath] + [fullPath]
    createAsrsDto.fullPath = `${createAsrsDto.fullPath}-`;
    createAsrsDto.fullPath = parentFullPath + createAsrsDto.fullPath;

    const asrs = await this.asrsRepository.create(createAsrsDto);

    await this.asrsRepository.save(asrs);
    return asrs;
  }

  async findAll() {
    return await this.asrsRepository.find();
  }

  async findOne(id: number) {
    const result = await this.asrsRepository.findOne({ where: { id: id } });
    return result;
  }

  async update(id: number, updateAsrsDto: UpdateAsrsDto) {
    const myInfo = await this.asrsRepository.findOne({ where: { id: id } });
    const parentInfo = await this.asrsRepository.findOne({
      where: { id: updateAsrsDto.parent },
    });
    if (!parentInfo)
      throw new HttpException('asrs의 부모 정보가 없습니다.', 400);

    if (!myInfo) throw new HttpException('asrs의 정보가 없습니다.', 400);
    // 부모의 fullPath 찾기
    const asrsFamily = await this.asrsRepository.find({
      where: { fullPath: Like(`%${myInfo.fullPath}%`) },
    });

    // 각 패밀리들의 업데이트 정보 세팅하기
    const newFamilyList = [];

    const newLevel = parentInfo ? parentInfo.level + 1 : 0;
    const parentFullPath = parentInfo ? parentInfo.fullPath : '';

    // 부모의 fullPath 조회 함수
    const getParentFullPath = (parent: number): string => {
      const foundElement = newFamilyList.find(
        (element) => element.id === parent,
      );
      return foundElement ? foundElement.fullPath || '' : '';
    };

    // 나와 패밀리의 새로운 정보 세팅
    for (let i = 0; i < asrsFamily.length; i += 1) {
      // (주의!)나의 정보인경우(familyList[i].id === myInfo.id)의 세팅값과 (나를 제외한)패밀리의 세팅값이 다르다.
      const parent =
        asrsFamily[i].id === myInfo.id ? parentInfo.id : asrsFamily[i].parent;
      const level =
        asrsFamily[i].id === myInfo.id
          ? newLevel
          : asrsFamily[i].level + (newLevel - myInfo.level);
      const parentPath =
        asrsFamily[i].id === myInfo.id
          ? parentFullPath
          : getParentFullPath(asrsFamily[i].parent);
      const name =
        asrsFamily[i].id === myInfo.id
          ? updateAsrsDto.name
          : asrsFamily[i].name;
      const myPath = `${name || asrsFamily[i].name}-`;
      const fullPath = (parentPath || '') + myPath;
      const orderby =
        asrsFamily[i].id === myInfo.id
          ? updateAsrsDto.orderby
          : asrsFamily[i].orderby;

      newFamilyList.push({
        id: asrsFamily[i].id,
        name: name,
        parent: parent,
        level: level,
        fullPath: fullPath,
        orderby: orderby,
      });
    }

    return this.asrsRepository.save(newFamilyList);
    // return this.asrsRepository.update(id, updateAsrsDto);
  }

  remove(id: number) {
    return this.asrsRepository.delete(id);
  }

  /**
   * plc로 들어온 데이터를 창고에 입력 데이터로 입력 후 이력 등록
   * awb와 asrs의 정보를 처리해야함
   * @param body
   */
  async createByPlcIn(body: CreateAsrsPlcDto) {
    // TODO: 가정된 데이터들 어떤 화물정보가 들어있을줄 모르니 다 분기처리할 것
    // 자동창고 Id 들어왔다고 가정
    const asrsId = +body.LH_ASRS_ID || +body.RH_ASRS_ID;
    const awbInfo = body.ASRS_LH_Rack1_Part_Info as unknown as {
      awbId: number;
      count: number;
    };
    // 화물정보 안에 화물Id 들어왔다고 가정
    const awbId = awbInfo.awbId;
    // 화물정보 안에 화물수량 들어왔다고 가정
    const count = awbInfo.count;
    // 화물이 인입인지 인출인지 확인
    let inOutType = '';
    if (body.In_Conveyor_Start) {
      inOutType = 'in';
    } else if (body.Out_Conveyor_Start) {
      inOutType = 'out';
    }

    const asrsHistoryBody: CreateAsrsHistoryDto = {
      Asrs: asrsId,
      Awb: awbId,
      inOutType: inOutType,
      count: count,
    };

    await this.asrsHistoryRepository.save(asrsHistoryBody);
  }
}
