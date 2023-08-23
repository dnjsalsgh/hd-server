import { HttpException, Injectable } from '@nestjs/common';
import { CreateSkidPlatformDto } from './dto/create-skid-platform.dto';
import { UpdateSkidPlatformDto } from './dto/update-skid-platform.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindOperator,
  ILike,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { SkidPlatform } from './entities/skid-platform.entity';
import { AsrsOutOrder } from '../asrs-out-order/entities/asrs-out-order.entity';
import { BasicqueryparamDto } from '../lib/dto/basicqueryparam.dto';
import { orderByUtil } from '../lib/util/orderBy.util';

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

  async findAll(query: SkidPlatform & BasicqueryparamDto) {
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
    return await this.skidPlatformRepository.find({
      where: {
        name: query.name ? ILike(`%${query.name}%`) : undefined,
        simulation: query.simulation,
        createdAt: findDate,
      },
      order: orderByUtil(query.order),
      take: query.limit,
      skip: query.offset,
    });
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
    if (updateSkidPlatformDto.parent && !parentInfo)
      throw new HttpException('asrs의 부모 정보가 없습니다.', 400);

    if (!myInfo) throw new HttpException('asrs의 정보가 없습니다.', 400);
    // 부모의 fullPath 찾기
    const asrsFamily = await this.skidPlatformRepository.find({
      where: { fullPath: Like(`%${myInfo.fullPath}%`) },
    });

    // 각 패밀리들의 업데이트 정보 세팅하기
    const newFamilyList = [];

    const newLevel = parentInfo ? parentInfo.level + 1 : 0;
    const parentId = parentInfo ? parentInfo.id : 0;
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
        asrsFamily[i].id === myInfo.id ? parentId : asrsFamily[i].parent;
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
}
