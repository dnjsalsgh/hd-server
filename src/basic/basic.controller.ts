import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BasicService } from './basic.service';
import { CreateBasicDto } from './dto/create-basic.dto';
import { UpdateBasicDto } from './dto/update-basic.dto';

@Controller('basic')
export class BasicController {
  constructor(private readonly basicService: BasicService) {}

  @Post()
  create(@Body() createBasicDto: CreateBasicDto) {
    return this.basicService.create(createBasicDto);
  }

  @Get()
  findAll() {
    return this.basicService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.basicService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBasicDto: UpdateBasicDto) {
    return this.basicService.update(+id, updateBasicDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.basicService.remove(+id);
  }
}
