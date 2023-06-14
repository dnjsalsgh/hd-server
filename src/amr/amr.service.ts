import { Injectable } from '@nestjs/common';
import { CreateAmrDto } from './dto/create-amr.dto';
import { UpdateAmrDto } from './dto/update-amr.dto';

@Injectable()
export class AmrService {
  create(createAmrDto: CreateAmrDto) {
    return 'This action adds a new amr';
  }

  findAll() {
    return `This action returns all amr`;
  }

  findOne(id: number) {
    return `This action returns a #${id} amr`;
  }

  update(id: number, updateAmrDto: UpdateAmrDto) {
    return `This action updates a #${id} amr`;
  }

  remove(id: number) {
    return `This action removes a #${id} amr`;
  }
}
