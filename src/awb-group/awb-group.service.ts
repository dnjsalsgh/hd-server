import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AwbGroup } from './entities/awb-group.entity';
import { CreateAwbGroupDto } from './dto/create-awb-group.dto';
import { UpdateAwbGroupDto } from './dto/update-awb-group.dto';

@Injectable()
export class AwbGroupService {
  constructor(
    @InjectRepository(AwbGroup)
    private readonly cargoGroupRepository: Repository<AwbGroup>,
  ) {}
  create(createCargoGroupDto: CreateAwbGroupDto) {
    return this.cargoGroupRepository.save(createCargoGroupDto);
  }

  findAll() {
    return this.cargoGroupRepository.find();
  }

  findOne(id: number) {
    return this.cargoGroupRepository.find({ where: { id: id } });
  }

  update(id: number, updateCargoGroupDto: UpdateAwbGroupDto) {
    return this.cargoGroupRepository.update(id, updateCargoGroupDto);
  }

  remove(id: number) {
    return this.cargoGroupRepository.delete(id);
  }
}
