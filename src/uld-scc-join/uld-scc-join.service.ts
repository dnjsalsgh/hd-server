import { Injectable } from '@nestjs/common';
import { CreateUldSccJoinDto } from './dto/create-uld-scc-join.dto';
import { UpdateUldSccJoinDto } from './dto/update-uld-scc-join.dto';

@Injectable()
export class UldSccJoinService {
  create(createUldSccJoinDto: CreateUldSccJoinDto) {
    return 'This action adds a new uldSccJoin';
  }

  findAll() {
    return `This action returns all uldSccJoin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} uldSccJoin`;
  }

  update(id: number, updateUldSccJoinDto: UpdateUldSccJoinDto) {
    return `This action updates a #${id} uldSccJoin`;
  }

  remove(id: number) {
    return `This action removes a #${id} uldSccJoin`;
  }
}
