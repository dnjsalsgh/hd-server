import { Injectable } from '@nestjs/common';
import { CreateCommonCodeDto } from './dto/create-common-code.dto';
import { UpdateCommonCodeDto } from './dto/update-common-code.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonCode } from './entities/common-code.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommonCodeService {
  constructor(
    @InjectRepository(CommonCode)
    private readonly commonCodeRepository: Repository<CommonCode>,
  ) {}
  async create(createCommonCodeDto: CreateCommonCodeDto) {
    const result = await this.commonCodeRepository.save(createCommonCodeDto);
    return result;
  }

  async findAll() {
    return await this.commonCodeRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} commonCode`;
  }

  update(id: number, updateCommonCodeDto: UpdateCommonCodeDto) {
    return `This action updates a #${id} commonCode`;
  }

  remove(id: number) {
    return `This action removes a #${id} commonCode`;
  }
}
