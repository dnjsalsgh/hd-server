import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HacsService } from './hacs.service';
import { CreateHacsDto } from './dto/create-hacs.dto';
import { UpdateHacsDto } from './dto/update-hacs.dto';

@Controller('hacs')
export class HacsController {
  constructor(private readonly hacsService: HacsService) {}

  @Post()
  create(@Body() createHacDto: CreateHacsDto) {
    return this.hacsService.create(createHacDto);
  }
}
