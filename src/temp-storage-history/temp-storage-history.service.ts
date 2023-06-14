import { Injectable } from '@nestjs/common';
import { CreateTempStorageHistoryDto } from './dto/create-temp-storage-history.dto';
import { UpdateTempStorageHistoryDto } from './dto/update-temp-storage-history.dto';

@Injectable()
export class TempStorageHistoryService {
  create(createTempStorageHistoryDto: CreateTempStorageHistoryDto) {
    return 'This action adds a new tempStorageHistory';
  }

  findAll() {
    return `This action returns all tempStorageHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tempStorageHistory`;
  }

  update(id: number, updateTempStorageHistoryDto: UpdateTempStorageHistoryDto) {
    return `This action updates a #${id} tempStorageHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} tempStorageHistory`;
  }
}
