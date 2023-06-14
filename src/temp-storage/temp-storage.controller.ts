import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TempStorageService } from './temp-storage.service';
import { CreateTempStorageDto } from './dto/create-temp-storage.dto';
import { UpdateTempStorageDto } from './dto/update-temp-storage.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('temp-storage')
@ApiTags('temp-storage')
export class TempStorageController {
  constructor(private readonly tempStorageService: TempStorageService) {}

  @Post()
  create(@Body() createTempStorageDto: CreateTempStorageDto) {
    return this.tempStorageService.create(createTempStorageDto);
  }

  @Get()
  findAll() {
    return this.tempStorageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tempStorageService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTempStorageDto: UpdateTempStorageDto,
  ) {
    return this.tempStorageService.update(+id, updateTempStorageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tempStorageService.remove(+id);
  }
}
