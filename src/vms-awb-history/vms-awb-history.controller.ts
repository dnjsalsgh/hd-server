import { Body, Controller, Post } from '@nestjs/common';
import { VmsAwbHistoryService } from './vms-awb-history.service';
import { CreateVmsAwbHistoryDto } from './dto/create-vms-awb-history.dto';

@Controller('vms-awb-history')
export class VmsAwbHistoryController {
  constructor(private readonly vmsAwbHistoryService: VmsAwbHistoryService) {}

  @Post()
  create(@Body() createVmsAwbHistoryDto: CreateVmsAwbHistoryDto) {
    return this.vmsAwbHistoryService.create(createVmsAwbHistoryDto);
  }
}
