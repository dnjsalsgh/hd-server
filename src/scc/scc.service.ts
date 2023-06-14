import { Injectable } from '@nestjs/common';
import { CreateSccDto } from './dto/create-scc.dto';
import { UpdateSccDto } from './dto/update-scc.dto';

@Injectable()
export class SccService {
  create(createSccDto: CreateSccDto) {
    return 'This action adds a new scc';
  }

  findAll() {
    return `This action returns all scc`;
  }

  findOne(id: number) {
    return `This action returns a #${id} scc`;
  }

  update(id: number, updateSccDto: UpdateSccDto) {
    return `This action updates a #${id} scc`;
  }

  remove(id: number) {
    return `This action removes a #${id} scc`;
  }
}
