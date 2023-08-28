import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { Vms } from './entities/vms.entity';
import { VmsService } from './vms.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateVmsDto } from './dto/create-vms.dto';

@Controller('vms')
@ApiTags('[VMS by mssql] VMS')
export class VmsController {
  constructor(private readonly vmsService: VmsService) {}

  @Post()
  create(@Body() createVmsDto: CreateVmsDto) {
    return this.vmsService.create(createVmsDto);
  }

  @Get()
  findAll(@Query() query: Vms & BasicQueryParamDto) {
    return this.vmsService.findAll(query);
  }
}
