import { Injectable } from '@nestjs/common';
import { CreateBuildUpOrderDto } from './dto/create-build-up-order.dto';
import { UpdateBuildUpOrderDto } from './dto/update-build-up-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BuildUpOrder } from './entities/build-up-order.entity';

@Injectable()
export class BuildUpOrderService {
  constructor(
    @InjectRepository(BuildUpOrder)
    private readonly inspectWorkOrderRepository: Repository<BuildUpOrder>,
  ) {}
  async create(createBuildUpOrderDto: CreateBuildUpOrderDto) {
    const result = await this.inspectWorkOrderRepository.save(
      createBuildUpOrderDto,
    );
    return result;
  }

  async findAll() {
    return await this.inspectWorkOrderRepository.find();
  }

  async findOne(id: number) {
    return await this.inspectWorkOrderRepository.find({ where: { id: id } });
  }

  update(id: number, updateBuildUpOrderDto: UpdateBuildUpOrderDto) {
    return this.inspectWorkOrderRepository.update(id, updateBuildUpOrderDto);
  }

  remove(id: number) {
    return this.inspectWorkOrderRepository.delete(id);
  }
}
