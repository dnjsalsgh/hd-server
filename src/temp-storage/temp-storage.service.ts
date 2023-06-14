import { Injectable } from '@nestjs/common';
import { CreateTempStorageDto } from './dto/create-temp-storage.dto';
import { UpdateTempStorageDto } from './dto/update-temp-storage.dto';

@Injectable()
export class TempStorageService {
  create(createTempStorageDto: CreateTempStorageDto) {
    return 'This action adds a new tempStorage';
  }

  findAll() {
    return `This action returns all tempStorage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tempStorage`;
  }

  update(id: number, updateTempStorageDto: UpdateTempStorageDto) {
    return `This action updates a #${id} tempStorage`;
  }

  remove(id: number) {
    return `This action removes a #${id} tempStorage`;
  }
}
