import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SkidPlatformService } from './skid-platform.service';
import { CreateSkidPlatformDto } from './dto/create-skid-platform.dto';
import { UpdateSkidPlatformDto } from './dto/update-skid-platform.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('skid-platform')
@ApiTags('skid-platform')
export class SkidPlatformController {
  constructor(private readonly skidPlatformService: SkidPlatformService) {}

  @Post()
  create(@Body() createSkidPlatformDto: CreateSkidPlatformDto) {
    return this.skidPlatformService.create(createSkidPlatformDto);
  }

  @Get()
  findAll() {
    return this.skidPlatformService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skidPlatformService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateSkidPlatformDto: UpdateSkidPlatformDto,
  ) {
    return this.skidPlatformService.update(+id, updateSkidPlatformDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.skidPlatformService.remove(+id);
  }
}
