import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BasicService } from './basic.service';
import { CreateBasicDto } from './dto/create-basic.dto';
import { UpdateBasicDto } from './dto/update-basic.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('basic')
@ApiTags('[Basic] Basic')
export class BasicController {
  constructor(private readonly basicService: BasicService) {}

  @Post()
  create(@Body() createBasicDto: CreateBasicDto) {
    return this.basicService.create(createBasicDto);
  }

  @Post('test/raw/insert/query')
  sendInsertQueryAtMssql(@Body() createBasicDto: CreateBasicDto) {
    return this.basicService.sendInsertQueryAtMssql();
  }

  @Get('test/raw/select/query')
  sendSelectQueryAtMssql() {
    return this.basicService.sendSelectQueryAtMssql();
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
