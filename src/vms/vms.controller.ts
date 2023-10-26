import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { Vms } from './entities/vms.entity';
import { VmsService } from './vms.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateVmsDto } from './dto/create-vms.dto';

@Controller('vms')
@ApiTags('[VMS by mssql] VMS')
export class VmsController {
  constructor(private readonly vmsService: VmsService) {}

  @Post()
  create(@Body() createVmsDto: CreateVmsDto) {
    return this.vmsService.create(createVmsDto);
  }

  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'createdAtFrom', required: false })
  @ApiQuery({ name: 'createdAtTo', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @Get()
  findAll(@Query() query: Vms & BasicQueryParamDto) {
    return this.vmsService.findAll(query);
  }
}
