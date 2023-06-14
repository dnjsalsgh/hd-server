import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StorageHistoryService } from './storage-history.service';
import { CreateStorageHistoryDto } from './dto/create-storage-history.dto';
import { UpdateStorageHistoryDto } from './dto/update-storage-history.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('storage-history')
@ApiTags('storage-history')
export class StorageHistoryController {
  constructor(private readonly storageHistoryService: StorageHistoryService) {}

  @Post()
  create(@Body() createStorageHistoryDto: CreateStorageHistoryDto) {
    return this.storageHistoryService.create(createStorageHistoryDto);
  }

  @Get()
  findAll() {
    return this.storageHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storageHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStorageHistoryDto: UpdateStorageHistoryDto,
  ) {
    return this.storageHistoryService.update(+id, updateStorageHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storageHistoryService.remove(+id);
  }
}
