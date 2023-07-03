import { Injectable } from '@nestjs/common';
import { CreateSccDto } from './dto/create-scc.dto';
import { UpdateSccDto } from './dto/update-scc.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scc } from './entities/scc.entity';

@Injectable()
export class SccService {
  constructor(
    @InjectRepository(Scc)
    private readonly sccRepository: Repository<Scc>,
  ) {}
  async create(createSccDto: CreateSccDto) {
    const result = await this.sccRepository.save(createSccDto);
    return result;
  }

  async findAll() {
    return await this.sccRepository.find();
  }

  async findOne(id: number) {
    return await this.sccRepository.find({ where: { id: id } });
  }

  update(id: number, updateSccDto: UpdateSccDto) {
    return this.sccRepository.update(id, updateSccDto);
  }

  remove(id: number) {
    return this.sccRepository.delete(id);
  }
}
