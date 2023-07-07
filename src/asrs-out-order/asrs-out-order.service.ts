import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAsrsOutOrderDto } from './dto/create-asrs-out-order.dto';
import { AsrsOutOrder } from './entities/asrs-out-order.entity';
import { UpdateAsrsOutOrderDto } from './dto/update-asrs-out-order.dto';

@Injectable()
export class AsrsOutOrderService {
  constructor(
    @InjectRepository(AsrsOutOrder)
    private readonly asrsOutOrderRepository: Repository<AsrsOutOrder>,
  ) {}
  async create(
    createAsrsOutOrderDto: CreateAsrsOutOrderDto,
  ): Promise<AsrsOutOrder> {
    const asrs = await this.asrsOutOrderRepository.create(
      createAsrsOutOrderDto,
    );

    await this.asrsOutOrderRepository.save(asrs);
    return asrs;
  }

  async findAll() {
    return await this.asrsOutOrderRepository.find();
  }

  async findOne(id: number) {
    const result = await this.asrsOutOrderRepository.findOne({
      where: { id: id },
    });
    return result;
  }

  update(id: number, updateAsrsOutOrderDto: UpdateAsrsOutOrderDto) {
    return this.asrsOutOrderRepository.update(id, updateAsrsOutOrderDto);
  }

  remove(id: number) {
    return this.asrsOutOrderRepository.delete(id);
  }
}
