import { Injectable } from '@nestjs/common';
import { CreateAmrChargerDto } from './dto/create-amr-charger.dto';
import { UpdateAmrChargerDto } from './dto/update-amr-charger.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Amr } from '../amr/entities/amr.entity';
import { Repository } from 'typeorm';
import { AmrCharger } from './entities/amr-charger.entity';

@Injectable()
export class AmrChargerService {
  constructor(
    @InjectRepository(AmrCharger)
    private readonly amrChargerRepository: Repository<AmrCharger>,
  ) {}
  create(createAmrChargerDto: CreateAmrChargerDto) {
    return this.amrChargerRepository.save(createAmrChargerDto);
  }

  findAll() {
    return this.amrChargerRepository.find();
  }

  findOne(id: number) {
    return this.amrChargerRepository.find({ where: { id: id } });
  }

  update(id: number, updateAmrChargerDto: UpdateAmrChargerDto) {
    return this.amrChargerRepository.update(id, updateAmrChargerDto);
  }

  remove(id: number) {
    return this.amrChargerRepository.delete(id);
  }
}
