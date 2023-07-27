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
import { UldService } from './uld.service';
import { CreateUldDto } from './dto/create-uld.dto';
import { UpdateUldDto } from './dto/update-uld.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AsrsHistory } from '../asrs-history/entities/asrs-history.entity';
import { BasicQueryParam } from '../lib/dto/basicQueryParam';
import { Uld } from './entities/uld.entity';

@Controller('uld')
@ApiTags('uld')
export class UldController {
  constructor(private readonly uldService: UldService) {}

  @Post()
  create(@Body() createUldDto: CreateUldDto) {
    return this.uldService.create(createUldDto);
  }

  @ApiQuery({ name: 'code', required: false })
  @ApiQuery({ name: 'airplaneType', required: false })
  @ApiQuery({ name: 'simulation', required: false })
  @ApiQuery({ name: 'UldType', required: false, type: 'number' })
  @ApiQuery({ name: 'createdAtFrom', required: false })
  @ApiQuery({ name: 'createdAtTo', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @Get()
  findAll(@Query() query: Uld & BasicQueryParam) {
    return this.uldService.findAll(query);
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
