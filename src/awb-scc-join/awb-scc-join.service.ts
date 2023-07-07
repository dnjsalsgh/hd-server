import { Injectable } from '@nestjs/common';
import { CreateAwbSccJoinDto } from './dto/create-awb-scc-join.dto';
import { UpdateAwbSccJoinDto } from './dto/update-awb-scc-join.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AwbSccJoin } from './entities/awb-scc-join.entity';

@Injectable()
export class AwbSccJoinService {
  constructor(
    @InjectRepository(AwbSccJoin)
    private readonly cargoGroupRepository: Repository<AwbSccJoin>,
  ) {}
  create(createCargoSccJoinDto: CreateAwbSccJoinDto) {
    return this.cargoGroupRepository.save(createCargoSccJoinDto);
  }

  findAll() {
    return this.cargoGroupRepository.find();
  }

  findOne(id: number) {
    return this.cargoGroupRepository.find({ where: { id: id } });
  }

  update(id: number, updateCargoSccJoinDto: UpdateAwbSccJoinDto) {
    return this.cargoGroupRepository.update(id, updateCargoSccJoinDto);
  }

  remove(id: number) {
    return this.cargoGroupRepository.delete(id);
  }
}
