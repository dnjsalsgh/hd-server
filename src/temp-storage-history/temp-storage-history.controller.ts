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
import { TempStorageHistoryService } from './temp-storage-history.service';
import { CreateTempStorageHistoryDto } from './dto/create-temp-storage-history.dto';
import { UpdateTempStorageHistoryDto } from './dto/update-temp-storage-history.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('temp-storage-history')
@ApiTags('temp-storage-history')
export class TempStorageHistoryController {
  constructor(
    private readonly tempStorageHistoryService: TempStorageHistoryService,
  ) {}

  @Post()
  create(@Body() createTempStorageHistoryDto: CreateTempStorageHistoryDto) {
    return this.tempStorageHistoryService.create(createTempStorageHistoryDto);
  }

  @Get()
  findAll() {
    return this.tempStorageHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tempStorageHistoryService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTempStorageHistoryDto: UpdateTempStorageHistoryDto,
  ) {
    return this.tempStorageHistoryService.update(
      +id,
      updateTempStorageHistoryDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tempStorageHistoryService.remove(+id);
  }
}
