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
import { SkidPlatformHistoryService } from './skid-platform-history.service';
import { CreateSkidPlatformHistoryDto } from './dto/create-skid-platform-history.dto';
import { UpdateSkidPlatformHistoryDto } from './dto/update-skid-platform-history.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('skid-platform-history')
@ApiTags('skid-platform-history')
export class SkidPlatformHistoryController {
  constructor(
    private readonly skidPlatformHistoryService: SkidPlatformHistoryService,
  ) {}

  @Post()
  create(@Body() createSkidPlatformHistoryDto: CreateSkidPlatformHistoryDto) {
    return this.skidPlatformHistoryService.create(createSkidPlatformHistoryDto);
  }

  @Get()
  findAll() {
    return this.skidPlatformHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skidPlatformHistoryService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateSkidPlatformHistoryDto: UpdateSkidPlatformHistoryDto,
  ) {
    return this.skidPlatformHistoryService.update(
      +id,
      updateSkidPlatformHistoryDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.skidPlatformHistoryService.remove(+id);
  }
}
