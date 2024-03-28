import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UldSccJoinService } from './uld-scc-join.service';
import { CreateUldSccJoinDto } from './dto/create-uld-scc-join.dto';
import { UpdateUldSccJoinDto } from './dto/update-uld-scc-join.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('uld-Scc-join')
@ApiTags('[사용 x] uld-Scc-join')
export class UldSccJoinController {
  constructor(private readonly uldSccJoinService: UldSccJoinService) {}

  @Post()
  create(@Body() createUldSccJoinDto: CreateUldSccJoinDto) {
    return this.uldSccJoinService.create(createUldSccJoinDto);
  }

  @Get()
  findAll() {
    return this.uldSccJoinService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uldSccJoinService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUldSccJoinDto: UpdateUldSccJoinDto,
  ) {
    return this.uldSccJoinService.update(+id, updateUldSccJoinDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uldSccJoinService.remove(+id);
  }
}
