import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UldTypeService } from './uld-type.service';
import { CreateUldTypeDto } from './dto/create-uld-type.dto';
import { UpdateUldTypeDto } from './dto/update-uld-type.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('uld-type')
@ApiTags('uld-type')
export class UldTypeController {
  constructor(private readonly uldTypeService: UldTypeService) {}

  @Post()
  create(@Body() createUldTypeDto: CreateUldTypeDto) {
    return this.uldTypeService.create(createUldTypeDto);
  }

  @Get()
  findAll() {
    return this.uldTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uldTypeService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUldTypeDto: UpdateUldTypeDto) {
    return this.uldTypeService.update(+id, updateUldTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uldTypeService.remove(+id);
  }
}
