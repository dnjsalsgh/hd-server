import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { SccService } from './scc.service';
import { CreateSccDto } from './dto/create-scc.dto';
import { UpdateSccDto } from './dto/update-scc.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { BasicQueryParam } from '../lib/dto/basicQueryParam';
import { Scc } from './entities/scc.entity';

@Controller('scc')
@ApiTags('scc')
export class SccController {
  constructor(private readonly sccService: SccService) {}

  @Post()
  create(@Body() createSccDto: CreateSccDto) {
    return this.sccService.create(createSccDto);
  }

  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'code', required: false })
  @ApiQuery({ name: 'createdAtFrom', required: false })
  @ApiQuery({ name: 'createdAtTo', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @Get()
  findAll(@Query() query: Scc & BasicQueryParam) {
    return this.sccService.findAll(query);
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
