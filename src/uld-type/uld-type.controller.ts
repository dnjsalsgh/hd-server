import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UldTypeService } from './uld-type.service';
import { CreateUldTypeDto } from './dto/create-uld-type.dto';
import { UpdateUldTypeDto } from './dto/update-uld-type.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Asrs } from '../asrs/entities/asrs.entity';
import { BasicQueryParam } from '../lib/dto/basicQueryParam';
import { UldType } from './entities/uld-type.entity';

@Controller('uld-type')
@ApiTags('uld-type')
export class UldTypeController {
  constructor(private readonly uldTypeService: UldTypeService) {}

  @Post()
  create(@Body() createUldTypeDto: CreateUldTypeDto) {
    return this.uldTypeService.create(createUldTypeDto);
  }

  @ApiQuery({ name: 'code', required: false })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'createdAtFrom', required: false })
  @ApiQuery({ name: 'createdAtTo', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @Get()
  findAll(@Query() query: UldType & BasicQueryParam) {
    return this.uldTypeService.findAll(query);
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
