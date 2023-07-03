import { Injectable } from '@nestjs/common';
import { CreateInspectWorkOrderDto } from './dto/create-inspect-work-order.dto';
import { UpdateInspectWorkOrderDto } from './dto/update-inspect-work-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InspectWorkOrder } from './entities/inspect-work-order.entity';

@Injectable()
export class InspectWorkOrderService {
  constructor(
    @InjectRepository(InspectWorkOrder)
    private readonly inspectWorkOrderRepository: Repository<InspectWorkOrder>,
  ) {}
  async create(createInspectWorkOrderDto: CreateInspectWorkOrderDto) {
    const result = await this.inspectWorkOrderRepository.save(
      createInspectWorkOrderDto,
    );
    return result;
  }

  async findAll() {
    return await this.inspectWorkOrderRepository.find();
  }

  async findOne(id: number) {
    return await this.inspectWorkOrderRepository.find({ where: { id: id } });
  }

  update(id: number, updateInspectWorkOrderDto: UpdateInspectWorkOrderDto) {
    return this.inspectWorkOrderRepository.update(
      id,
      updateInspectWorkOrderDto,
    );
  }

  remove(id: number) {
    return this.inspectWorkOrderRepository.delete(id);
  }
}
