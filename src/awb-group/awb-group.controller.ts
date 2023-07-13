import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AwbGroupService } from './awb-group.service';
import { CreateAwbGroupDto } from './dto/create-awb-group.dto';
import { UpdateAwbGroupDto } from './dto/update-awb-group.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('awb-group')
@ApiTags('awb-group')
export class AwbGroupController {
  constructor(private readonly cargoGroupService: AwbGroupService) {}

  @Post()
  create(@Body() createCargoGroupDto: CreateAwbGroupDto) {
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

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCargoGroupDto: UpdateAwbGroupDto,
  ) {
    return this.cargoGroupService.update(+id, updateCargoGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cargoGroupService.remove(+id);
  }
}
