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
    private readonly buildUpOrderRepository: Repository<BuildUpOrder>,
  ) {}
  async create(createBuildUpOrderDto: CreateBuildUpOrderDto) {
    const result = await this.buildUpOrderRepository.save(
      createBuildUpOrderDto,
    );
    return result;
  }

  async findAll() {
    return await this.buildUpOrderRepository.find();
  }

  async findOne(id: number) {
    return await this.buildUpOrderRepository.find({ where: { id: id } });
  }

  update(id: number, updateBuildUpOrderDto: UpdateBuildUpOrderDto) {
    return this.buildUpOrderRepository.update(id, updateBuildUpOrderDto);
  }

  remove(id: number) {
    return this.buildUpOrderRepository.delete(id);
  }
}
