import { Injectable } from '@nestjs/common';
import { CreateUldSccJoinDto } from './dto/create-uld-scc-join.dto';
import { UpdateUldSccJoinDto } from './dto/update-uld-scc-join.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UldSccJoin } from './entities/uld-scc-join.entity';

@Injectable()
export class UldSccJoinService {
  constructor(
    @InjectRepository(UldSccJoin)
    private readonly uldSccJoinRepository: Repository<UldSccJoin>,
  ) {}
  async create(createUldSccJoinDto: CreateUldSccJoinDto) {
    const result = await this.uldSccJoinRepository.create(createUldSccJoinDto);

    await this.uldSccJoinRepository.save(result);
    return result;
  }

  async findAll() {
    return await this.uldSccJoinRepository.find();
  }

  async findOne(id: number) {
    const result = await this.uldSccJoinRepository.findOne({
      where: { id: id },
    });
    return result;
  }

  update(id: number, updateUldSccJoinDto: UpdateUldSccJoinDto) {
    return this.uldSccJoinRepository.update(id, updateUldSccJoinDto);
  }

  remove(id: number) {
    return this.uldSccJoinRepository.delete(id);
  }
}
