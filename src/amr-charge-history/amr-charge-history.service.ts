import { Injectable } from '@nestjs/common';
import { CreateAmrChargeHistoryDto } from './dto/create-amr-charge-history.dto';
import { UpdateAmrChargeHistoryDto } from './dto/update-amr-charge-history.dto';

@Injectable()
export class AmrChargeHistoryService {
  create(createAmrChargeHistoryDto: CreateAmrChargeHistoryDto) {
    return 'This action adds a new amrChargeHistory';
  }

  findAll() {
    return `This action returns all amrChargeHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} amrChargeHistory`;
  }

  update(id: number, updateAmrChargeHistoryDto: UpdateAmrChargeHistoryDto) {
    return `This action updates a #${id} amrChargeHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} amrChargeHistory`;
  }
}
