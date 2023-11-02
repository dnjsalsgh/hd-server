import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { VmsAwbResultService } from './vms-awb-result.service';
import { ApiQuery } from '@nestjs/swagger';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { VmsAwbResult } from './entities/vms-awb-result.entity';
import { CreateVmsAwbResultDto } from './dto/create-vms-awb-result.dto';

@Controller('vms-awb-result')
export class VmsAwbResultController {
  constructor(private readonly vmsAwbResultService: VmsAwbResultService) {}

  @Post()
  create(@Body() createVmsAwbResultDto: CreateVmsAwbResultDto) {
    return this.vmsAwbResultService.create(createVmsAwbResultDto);
  }

  @ApiQuery({ name: 'createdAtFrom', required: false })
  @ApiQuery({ name: 'createdAtTo', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @Get()
  findAll(@Query() query: VmsAwbResult & BasicQueryParamDto) {
    return this.vmsAwbResultService.findAll(query);
  }
}
