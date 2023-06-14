import { Injectable } from '@nestjs/common';
import { CreateUldTypeDto } from './dto/create-uld-type.dto';
import { UpdateUldTypeDto } from './dto/update-uld-type.dto';

@Injectable()
export class UldTypeService {
  create(createUldTypeDto: CreateUldTypeDto) {
    return 'This action adds a new uldType';
  }

  findAll() {
    return `This action returns all uldType`;
  }

  findOne(id: number) {
    return `This action returns a #${id} uldType`;
  }

  update(id: number, updateUldTypeDto: UpdateUldTypeDto) {
    return `This action updates a #${id} uldType`;
  }

  remove(id: number) {
    return `This action removes a #${id} uldType`;
  }
}
