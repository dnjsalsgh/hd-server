import { Injectable } from '@nestjs/common';
import { CreateAmrChargerDto } from './dto/create-amr-charger.dto';
import { UpdateAmrChargerDto } from './dto/update-amr-charger.dto';

@Injectable()
export class AmrChargerService {
  create(createAmrChargerDto: CreateAmrChargerDto) {
    return 'This action adds a new amrCharger';
  }

  findAll() {
    return `This action returns all amrCharger`;
  }

  findOne(id: number) {
    return `This action returns a #${id} amrCharger`;
  }

  update(id: number, updateAmrChargerDto: UpdateAmrChargerDto) {
    return `This action updates a #${id} amrCharger`;
  }

  remove(id: number) {
    return `This action removes a #${id} amrCharger`;
  }
}
