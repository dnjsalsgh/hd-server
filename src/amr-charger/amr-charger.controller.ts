import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AmrChargerService } from './amr-charger.service';
import { CreateAmrChargerDto } from './dto/create-amr-charger.dto';
import { UpdateAmrChargerDto } from './dto/update-amr-charger.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('amr-charger')
@ApiTags('amr-charge')
export class AmrChargerController {
  constructor(private readonly amrChargerService: AmrChargerService) {}

  @Post()
  create(@Body() createAmrChargerDto: CreateAmrChargerDto) {
    return this.amrChargerService.create(createAmrChargerDto);
  }

  @Get()
  findAll() {
    return this.amrChargerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.amrChargerService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateAmrChargerDto: UpdateAmrChargerDto,
  ) {
    return this.amrChargerService.update(+id, updateAmrChargerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.amrChargerService.remove(+id);
  }
}
