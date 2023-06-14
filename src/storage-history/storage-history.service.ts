import { Injectable } from '@nestjs/common';
import { CreateStorageHistoryDto } from './dto/create-storage-history.dto';
import { UpdateStorageHistoryDto } from './dto/update-storage-history.dto';

@Injectable()
export class StorageHistoryService {
  create(createStorageHistoryDto: CreateStorageHistoryDto) {
    return 'This action adds a new storageHistory';
  }

  findAll() {
    return `This action returns all storageHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} storageHistory`;
  }

  update(id: number, updateStorageHistoryDto: UpdateStorageHistoryDto) {
    return `This action updates a #${id} storageHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} storageHistory`;
  }
}
