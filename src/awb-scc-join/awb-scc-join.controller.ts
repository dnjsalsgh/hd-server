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
import { AwbSccJoinService } from './awb-scc-join.service';
import { CreateAwbSccJoinDto } from './dto/create-awb-scc-join.dto';
import { UpdateAwbSccJoinDto } from './dto/update-awb-scc-join.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('awb-scc-join')
@ApiTags('awb-scc-join')
export class AwbSccJoinController {
  constructor(private readonly cargoSccJoinService: AwbSccJoinService) {}

  @Post()
  create(@Body() createCargoSccJoinDto: CreateAwbSccJoinDto) {
    return this.cargoSccJoinService.create(createCargoSccJoinDto);
  }

  @Get()
  findAll() {
    return this.cargoSccJoinService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cargoSccJoinService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCargoSccJoinDto: UpdateAwbSccJoinDto,
  ) {
    return this.cargoSccJoinService.update(+id, updateCargoSccJoinDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cargoSccJoinService.remove(+id);
  }
}
