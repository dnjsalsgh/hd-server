import { Injectable } from '@nestjs/common';
import { CreateSkidPlatformDto } from './dto/create-skid-platform.dto';
import { UpdateSkidPlatformDto } from './dto/update-skid-platform.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SkidPlatform } from './entities/skid-platform.entity';

@Injectable()
export class SkidPlatformService {
  constructor(
    @InjectRepository(SkidPlatform)
    private readonly skidPlatformRepository: Repository<SkidPlatform>,
  ) {}
  async create(createSkidPlatformDto: CreateSkidPlatformDto) {
    const asrs = await this.skidPlatformRepository.create(
      createSkidPlatformDto,
    );

    await this.skidPlatformRepository.save(asrs);
    return asrs;
  }

  async findAll() {
    return await this.skidPlatformRepository.find();
  }

  async findOne(id: number) {
    const result = await this.skidPlatformRepository.findOne({
      where: { id: id },
    });
    return result;
  }

  update(id: number, updateSkidPlatformDto: UpdateSkidPlatformDto) {
    return this.skidPlatformRepository.update(id, updateSkidPlatformDto);
  }

  remove(id: number) {
    return this.skidPlatformRepository.delete(id);
  }
}
