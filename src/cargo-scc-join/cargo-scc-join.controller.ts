import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CargoSccJoinService } from './cargo-scc-join.service';
import { CreateCargoSccJoinDto } from './dto/create-cargo-scc-join.dto';
import { UpdateCargoSccJoinDto } from './dto/update-cargo-scc-join.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('cargo-scc-join')
@ApiTags('cargo-scc-join')
export class CargoSccJoinController {
  constructor(private readonly cargoSccJoinService: CargoSccJoinService) {}

  @Post()
  create(@Body() createCargoSccJoinDto: CreateCargoSccJoinDto) {
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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCargoSccJoinDto: UpdateCargoSccJoinDto,
  ) {
    return this.cargoSccJoinService.update(+id, updateCargoSccJoinDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cargoSccJoinService.remove(+id);
  }
}
