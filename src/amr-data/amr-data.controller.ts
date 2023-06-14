import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AmrDataService } from './amr-data.service';
import { CreateAmrDatumDto } from './dto/create-amr-datum.dto';
import { UpdateAmrDatumDto } from './dto/update-amr-datum.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('amr-data')
@ApiTags('amr-data')
export class AmrDataController {
  constructor(private readonly amrDataService: AmrDataService) {}

  @Post()
  create(@Body() createAmrDatumDto: CreateAmrDatumDto) {
    return this.amrDataService.create(createAmrDatumDto);
  }

  @Get()
  findAll() {
    return this.amrDataService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.amrDataService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAmrDatumDto: UpdateAmrDatumDto,
  ) {
    return this.amrDataService.update(+id, updateAmrDatumDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.amrDataService.remove(+id);
  }
}
