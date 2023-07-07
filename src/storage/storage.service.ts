import { HttpException, Injectable } from '@nestjs/common';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Storage } from './entities/storage.entity';
import { Like, Repository } from 'typeorm';
import { ResponseDto } from '../lib/dto/response.dto';

@Injectable()
export class StorageService {
  constructor(
    @InjectRepository(Storage)
    private readonly storageRepository: Repository<Storage>,
  ) {}
  async create(createStorageDto: CreateStorageDto): Promise<Storage> {
    let parentStorage;
    let parentFullPath = '';

    // 부모 정보가 들어올 시
    if (createStorageDto.parent > 0) {
      parentStorage = await this.storageRepository.findOne({
        where: {
          id: createStorageDto.parent,
        },
      });

      // 부모정보가 없다면 throw
      if (!parentStorage)
        throw new HttpException('storage의 부모 정보가 없습니다.', 400);

      // 부모 level + 1
      createStorageDto.level = parentStorage.level + 1;

      parentFullPath = parentStorage.fullPath;
    }

    // fullPath 설정 [부모fullPath] + [fullPath]
    createStorageDto.fullPath = `${createStorageDto.fullPath}-`;
    createStorageDto.fullPath = parentFullPath + createStorageDto.fullPath;

    const storage = await this.storageRepository.create(createStorageDto);

    await this.storageRepository.save(storage);
    return storage;
  }

  async findAll() {
    return await this.storageRepository.find();
  }

  async findOne(id: number) {
    const result = await this.storageRepository.findOne({ where: { id: id } });
    return result;
  }

  async update(id: number, updateStorageDto: UpdateStorageDto) {
    const myInfo = await this.storageRepository.findOne({ where: { id: id } });
    const parentInfo = await this.storageRepository.findOne({
      where: { id: updateStorageDto.parent },
    });
    if (!parentInfo)
      throw new HttpException('storage의 부모 정보가 없습니다.', 400);

    if (!myInfo) throw new HttpException('storage의 정보가 없습니다.', 400);
    // 부모의 fullPath 찾기
    const storageFamily = await this.storageRepository.find({
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
    for (let i = 0; i < storageFamily.length; i += 1) {
      // (주의!)나의 정보인경우(familyList[i].id === myInfo.id)의 세팅값과 (나를 제외한)패밀리의 세팅값이 다르다.
      const parent =
        storageFamily[i].id === myInfo.id
          ? parentInfo.id
          : storageFamily[i].parent;
      const level =
        storageFamily[i].id === myInfo.id
          ? newLevel
          : storageFamily[i].level + (newLevel - myInfo.level);
      const parentPath =
        storageFamily[i].id === myInfo.id
          ? parentFullPath
          : getParentFullPath(storageFamily[i].parent);
      const name =
        storageFamily[i].id === myInfo.id
          ? updateStorageDto.name
          : storageFamily[i].name;
      const myPath = `${name || storageFamily[i].name}-`;
      const fullPath = (parentPath || '') + myPath;
      const orderby =
        storageFamily[i].id === myInfo.id
          ? updateStorageDto.orderby
          : storageFamily[i].orderby;

      newFamilyList.push({
        id: storageFamily[i].id,
        name: name,
        parent: parent,
        level: level,
        fullPath: fullPath,
        orderby: orderby,
      });
    }

    return this.storageRepository.save(newFamilyList);
    // return this.storageRepository.update(id, updateStorageDto);
  }

  remove(id: number) {
    return this.storageRepository.delete(id);
  }
}
