import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CargoGroupService } from './cargo-group.service';
import { CreateCargoGroupDto } from './dto/create-cargo-group.dto';
import { UpdateCargoGroupDto } from './dto/update-cargo-group.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('cargo-group')
@ApiTags('cargo-group')
export class CargoGroupController {
  constructor(private readonly cargoGroupService: CargoGroupService) {}

  @Post()
  create(@Body() createCargoGroupDto: CreateCargoGroupDto) {
    return this.cargoGroupService.create(createCargoGroupDto);
  }

  @Get()
  findAll() {
    return this.cargoGroupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cargoGroupService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCargoGroupDto: UpdateCargoGroupDto,
  ) {
    return this.cargoGroupService.update(+id, updateCargoGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cargoGroupService.remove(+id);
  }
}
