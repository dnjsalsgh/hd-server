import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StorageWorkOrderService } from './storage-work-order.service';
import { CreateStorageWorkOrderDto } from './dto/create-storage-work-order.dto';
import { UpdateStorageWorkOrderDto } from './dto/update-storage-work-order.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('storage-work-order')
@ApiTags('storage-work-order')
export class StorageWorkOrderController {
  constructor(
    private readonly storageWorkOrderService: StorageWorkOrderService,
  ) {}

  @Post()
  create(@Body() createStorageWorkOrderDto: CreateStorageWorkOrderDto) {
    return this.storageWorkOrderService.create(createStorageWorkOrderDto);
  }

  @Get()
  findAll() {
    return this.storageWorkOrderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storageWorkOrderService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStorageWorkOrderDto: UpdateStorageWorkOrderDto,
  ) {
    return this.storageWorkOrderService.update(+id, updateStorageWorkOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storageWorkOrderService.remove(+id);
  }
}
