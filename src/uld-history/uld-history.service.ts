import { Injectable } from '@nestjs/common';
import { CreateUldHistoryDto } from './dto/create-uld-history.dto';
import { UpdateUldHistoryDto } from './dto/update-uld-history.dto';

@Injectable()
export class UldHistoryService {
  create(createUldHistoryDto: CreateUldHistoryDto) {
    return 'This action adds a new uldHistory';
  }

  findAll() {
    return `This action returns all uldHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} uldHistory`;
  }

  update(id: number, updateUldHistoryDto: UpdateUldHistoryDto) {
    return `This action updates a #${id} uldHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} uldHistory`;
  }
}
