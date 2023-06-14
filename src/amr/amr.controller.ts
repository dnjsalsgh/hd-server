import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AmrService } from './amr.service';
import { CreateAmrDto } from './dto/create-amr.dto';
import { UpdateAmrDto } from './dto/update-amr.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('amr')
@ApiTags('amr')
export class AmrController {
  constructor(private readonly amrService: AmrService) {}

  @Post()
  create(@Body() createAmrDto: CreateAmrDto) {
    return this.amrService.create(createAmrDto);
  }

  @Get()
  findAll() {
    return this.amrService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.amrService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAmrDto: UpdateAmrDto) {
    return this.amrService.update(+id, updateAmrDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.amrService.remove(+id);
  }
}
