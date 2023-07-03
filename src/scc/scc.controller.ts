import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SccService } from './scc.service';
import { CreateSccDto } from './dto/create-scc.dto';
import { UpdateSccDto } from './dto/update-scc.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('scc')
@ApiTags('scc')
export class SccController {
  constructor(private readonly sccService: SccService) {}

  @Post()
  create(@Body() createSccDto: CreateSccDto) {
    return this.sccService.create(createSccDto);
  }

  @Get()
  findAll() {
    return this.sccService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sccService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSccDto: UpdateSccDto) {
    return this.sccService.update(+id, updateSccDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sccService.remove(+id);
  }
}
