import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UldService } from './uld.service';
import { CreateUldDto } from './dto/create-uld.dto';
import { UpdateUldDto } from './dto/update-uld.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('uld')
@ApiTags('uld')
export class UldController {
  constructor(private readonly uldService: UldService) {}

  @Post()
  create(@Body() createUldDto: CreateUldDto) {
    return this.uldService.create(createUldDto);
  }

  @Get()
  findAll() {
    return this.uldService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uldService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUldDto: UpdateUldDto) {
    return this.uldService.update(+id, updateUldDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uldService.remove(+id);
  }
}
