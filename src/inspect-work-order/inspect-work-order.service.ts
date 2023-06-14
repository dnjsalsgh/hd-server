import { Injectable } from '@nestjs/common';
import { CreateInspectWorkOrderDto } from './dto/create-inspect-work-order.dto';
import { UpdateInspectWorkOrderDto } from './dto/update-inspect-work-order.dto';

@Injectable()
export class InspectWorkOrderService {
  create(createInspectWorkOrderDto: CreateInspectWorkOrderDto) {
    return 'This action adds a new inspectWorkOrder';
  }

  findAll() {
    return `This action returns all inspectWorkOrder`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inspectWorkOrder`;
  }

  update(id: number, updateInspectWorkOrderDto: UpdateInspectWorkOrderDto) {
    return `This action updates a #${id} inspectWorkOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} inspectWorkOrder`;
  }
}
