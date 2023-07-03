import { Injectable } from '@nestjs/common';
import { CreateUldTypeDto } from './dto/create-uld-type.dto';
import { UpdateUldTypeDto } from './dto/update-uld-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UldType } from './entities/uld-type.entity';

@Injectable()
export class UldTypeService {
  constructor(
    @InjectRepository(UldType)
    private readonly uldTypeRepository: Repository<UldType>,
  ) {}
  async create(createUldTypeDto: CreateUldTypeDto) {
    const result = await this.uldTypeRepository.create(createUldTypeDto);

    await this.uldTypeRepository.save(result);
    return result;
  }

  async findAll() {
    return await this.uldTypeRepository.find();
  }

  async findOne(id: number) {
    const result = await this.uldTypeRepository.findOne({
      where: { id: id },
    });
    return result;
  }

  update(id: number, updateUldTypeDto: UpdateUldTypeDto) {
    return this.uldTypeRepository.update(id, updateUldTypeDto);
  }

  remove(id: number) {
    return this.uldTypeRepository.delete(id);
  }
}
