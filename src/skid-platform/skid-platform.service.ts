import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSkidPlatformDto } from './dto/create-skid-platform.dto';
import { UpdateSkidPlatformDto } from './dto/update-skid-platform.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { SkidPlatform } from './entities/skid-platform.entity';
import { CreateAsrsPlcDto } from '../asrs/dto/create-asrs-plc.dto';
import { CreateSkidPlatformHistoryDto } from '../skid-platform-history/dto/create-skid-platform-history.dto';
import { SkidPlatformHistory } from '../skid-platform-history/entities/skid-platform-history.entity';
import { AsrsOutOrder } from '../asrs-out-order/entities/asrs-out-order.entity';
import { CreateAsrsOutOrderDto } from '../asrs-out-order/dto/create-asrs-out-order.dto';

@Injectable()
export class SkidPlatformService {
  constructor(
    @InjectRepository(SkidPlatform)
    private readonly skidPlatformRepository: Repository<SkidPlatform>,
    @InjectRepository(AsrsOutOrder)
    private readonly asrsOutOrderRepository: Repository<AsrsOutOrder>,
  ) {}
  async create(createSkidPlatformDto: CreateSkidPlatformDto) {
    let parentSkidPlatform;
    let parentFullPath = '';

    // 부모 정보가 들어올 시
    if (createSkidPlatformDto.parent > 0) {
      parentSkidPlatform = await this.skidPlatformRepository.findOne({
        where: {
          id: createSkidPlatformDto.parent,
        },
      });

      // 부모정보가 없다면 throw
      if (!parentSkidPlatform)
        throw new HttpException('asrs의 부모 정보가 없습니다.', 400);

      // 부모 level + 1
      createSkidPlatformDto.level = parentSkidPlatform.level + 1;

      parentFullPath = parentSkidPlatform.fullPath;
    }

    // fullPath 설정 [부모fullPath] + [fullPath]
    createSkidPlatformDto.fullPath = `${createSkidPlatformDto.fullPath}-`;
    createSkidPlatformDto.fullPath =
      parentFullPath + createSkidPlatformDto.fullPath;

    const asrs = await this.skidPlatformRepository.create(
      createSkidPlatformDto,
    );

    await this.skidPlatformRepository.save(asrs);
    return asrs;
  }

  async findAll() {
    return await this.skidPlatformRepository.find();
  }

  async findOne(id: number) {
    const result = await this.skidPlatformRepository.findOne({
      where: { id: id },
    });
    return result;
  }

  async update(id: number, updateSkidPlatformDto: UpdateSkidPlatformDto) {
    const myInfo = await this.skidPlatformRepository.findOne({
      where: { id: id },
    });
    const parentInfo = await this.skidPlatformRepository.findOne({
      where: { id: updateSkidPlatformDto.parent },
    });
    if (!parentInfo)
      throw new HttpException('asrs의 부모 정보가 없습니다.', 400);

    if (!myInfo) throw new HttpException('asrs의 정보가 없습니다.', 400);
    // 부모의 fullPath 찾기
    const asrsFamily = await this.skidPlatformRepository.find({
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
          ? updateSkidPlatformDto.name
          : asrsFamily[i].name;
      const myPath = `${name || asrsFamily[i].name}-`;
      const fullPath = (parentPath || '') + myPath;
      const orderby =
        asrsFamily[i].id === myInfo.id
          ? updateSkidPlatformDto.orderby
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

    return this.skidPlatformRepository.save(newFamilyList);
  }

  remove(id: number) {
    return this.skidPlatformRepository.delete(id);
  }

  /**
   * plc로 들어온 데이터를 가지고 창고에서 안착대로 이동
   * asrs와 skid-platform의 정보를 처리해야함
   * @param body
   */
  async createByPlcOut(body: CreateAsrsPlcDto) {
    // TODO: 가정된 데이터들 어떤 화물정보가 들어있을줄 모르니 다 분기처리할 것
    // 자동창고 Id 들어왔다고 가정
    const asrsId = +body.LH_ASRS_ID || +body.RH_ASRS_ID;
    const awbInfo = body.ASRS_LH_Rack1_Part_Info as unknown as {
      awbId: number;
    };
    // 화물정보 안에 화물Id 들어왔다고 가정
    const awbId = awbInfo.awbId;

    // TODO: 패키지 시뮬레이터의 api를 활용해서 자동창고 작업지시를 만들어야 합니다.
    const asrsOutOrderBody: CreateAsrsOutOrderDto = {
      order: 1,
      Asrs: asrsId,
      SkidPlatform: 1, // api에서는 목표 안착대의 id가 들어온다.
      Awb: awbId,
    };

    // plc 데이터를 기반으로 작업지시 생성
    await this.asrsOutOrderRepository.save(asrsOutOrderBody);
  }
}
