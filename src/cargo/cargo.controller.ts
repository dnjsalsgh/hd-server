import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CargoService } from './cargo.service';
import { CreateCargoDto } from './dto/create-cargo.dto';
import { UpdateCargoDto } from './dto/update-cargo.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('cargo')
@ApiTags('cargo')
export class CargoController {
  constructor(private readonly cargoService: CargoService) {}

  @Post()
  create(@Body() createCargoDto: CreateCargoDto) {
    return this.cargoService.create(createCargoDto);
  }

  @ApiOperation({ summary: '해포 실행' })
  @Post('/break-down/:parent')
  breakDown(
    @Param('parent') parent: string,
    @Body() createCargoDtoArray: CreateCargoDto[],
  ) {
    return this.cargoService.breakDown(parent, createCargoDtoArray);
  }

  @Get()
  findAll() {
    return this.cargoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cargoService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCargoDto: UpdateCargoDto) {
    return this.cargoService.update(+id, updateCargoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cargoService.remove(+id);
  }
}
