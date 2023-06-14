import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UldHistoryService } from './uld-history.service';
import { CreateUldHistoryDto } from './dto/create-uld-history.dto';
import { UpdateUldHistoryDto } from './dto/update-uld-history.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('uld-history')
@ApiTags('uld-history')
export class UldHistoryController {
  constructor(private readonly uldHistoryService: UldHistoryService) {}

  @Post()
  create(@Body() createUldHistoryDto: CreateUldHistoryDto) {
    return this.uldHistoryService.create(createUldHistoryDto);
  }

  @Get()
  findAll() {
    return this.uldHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uldHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUldHistoryDto: UpdateUldHistoryDto,
  ) {
    return this.uldHistoryService.update(+id, updateUldHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uldHistoryService.remove(+id);
  }
}
