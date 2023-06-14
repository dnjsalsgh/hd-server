import { Injectable } from '@nestjs/common';
import { CreateAmrDatumDto } from './dto/create-amr-datum.dto';
import { UpdateAmrDatumDto } from './dto/update-amr-datum.dto';

@Injectable()
export class AmrDataService {
  create(createAmrDatumDto: CreateAmrDatumDto) {
    return 'This action adds a new amrDatum';
  }

  findAll() {
    return `This action returns all amrData`;
  }

  findOne(id: number) {
    return `This action returns a #${id} amrDatum`;
  }

  update(id: number, updateAmrDatumDto: UpdateAmrDatumDto) {
    return `This action updates a #${id} amrDatum`;
  }

  remove(id: number) {
    return `This action removes a #${id} amrDatum`;
  }
}
