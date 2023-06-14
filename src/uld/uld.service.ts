import { Injectable } from '@nestjs/common';
import { CreateUldDto } from './dto/create-uld.dto';
import { UpdateUldDto } from './dto/update-uld.dto';

@Injectable()
export class UldService {
  create(createUldDto: CreateUldDto) {
    return 'This action adds a new uld';
  }

  findAll() {
    return `This action returns all uld`;
  }

  findOne(id: number) {
    return `This action returns a #${id} uld`;
  }

  update(id: number, updateUldDto: UpdateUldDto) {
    return `This action updates a #${id} uld`;
  }

  remove(id: number) {
    return `This action removes a #${id} uld`;
  }
}
