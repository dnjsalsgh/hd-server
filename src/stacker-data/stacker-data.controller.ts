import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StackerDataService } from './stacker-data.service';
import { CreateStackerDataDto } from './dto/create-stacker-data.dto';
import { UpdateStackerDataDto } from './dto/update-stacker-data.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('stacker-data')
@ApiTags('stacker-data')
export class StackerDataController {
  constructor(private readonly stackerDataService: StackerDataService) {}

  @Post()
  create(@Body() createStackerDatumDto: CreateStackerDataDto) {
    return this.stackerDataService.create(createStackerDatumDto);
  }

  @Get()
  findAll() {
    return this.stackerDataService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stackerDataService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStackerDatumDto: UpdateStackerDataDto,
  ) {
    return this.stackerDataService.update(+id, updateStackerDatumDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stackerDataService.remove(+id);
  }
}
