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

  async update(id: number, updateSccDto: UpdateSccDto) {
    const updateResult = await this.sccRepository.update(id, updateSccDto);
    // const updateResult1 = await this.sccRepository
    //   .createQueryBuilder()
    //   .update(Scc)
    //   .set(updateSccDto)
    //   .where('id = :id', { id: id })
    //   .execute();

    return updateResult;
  }

  remove(id: number) {
    return this.sccRepository.delete(id);
  }
}
