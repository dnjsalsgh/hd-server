import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CargoListService } from './cargo-list.service';
import { CreateCargoListDto } from './dto/create-cargo-list.dto';
import { UpdateCargoListDto } from './dto/update-cargo-list.dto';

@Controller('cargo-list')
export class CargoListController {
  constructor(private readonly cargoListService: CargoListService) {}

  @Post()
  create(@Body() createCargoListDto: CreateCargoListDto) {
    return this.cargoListService.create(createCargoListDto);
  }

  @Get()
  findAll() {
    return this.cargoListService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cargoListService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCargoListDto: UpdateCargoListDto,
  ) {
    return this.cargoListService.update(+id, updateCargoListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cargoListService.remove(+id);
  }
}
