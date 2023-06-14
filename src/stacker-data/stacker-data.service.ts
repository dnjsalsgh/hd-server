import { Injectable } from '@nestjs/common';
import { CreateStackerDataDto } from './dto/create-stacker-data.dto';
import { UpdateStackerDataDto } from './dto/update-stacker-data.dto';

@Injectable()
export class StackerDataService {
  create(createStackerDatumDto: CreateStackerDataDto) {
    return 'This action adds a new stackerDatum';
  }

  findAll() {
    return `This action returns all stackerData`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stackerDatum`;
  }

  update(id: number, updateStackerDatumDto: UpdateStackerDataDto) {
    return `This action updates a #${id} stackerDatum`;
  }

  remove(id: number) {
    return `This action removes a #${id} stackerDatum`;
  }
}
