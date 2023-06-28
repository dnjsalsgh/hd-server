import { Injectable } from '@nestjs/common';
import { CreateCommonCodeDto } from './dto/create-common-code.dto';
import { UpdateCommonCodeDto } from './dto/update-common-code.dto';

@Injectable()
export class CommonCodeService {
  create(createCommonCodeDto: CreateCommonCodeDto) {
    return 'This action adds a new commonCode';
  }

  findAll() {
    return `This action returns all commonCode`;
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
