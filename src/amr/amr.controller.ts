import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AmrService } from './amr.service';
import { CreateAmrDto } from './dto/create-amr.dto';
import { UpdateAmrDto } from './dto/update-amr.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AmrRawDto } from './dto/amr-raw.dto';

@Controller('amr')
@ApiTags('amr')
export class AmrController {
  constructor(private readonly amrService: AmrService) {}

  @Post()
  create(@Body() createAmrDto: CreateAmrDto) {
    return this.amrService.create(createAmrDto);
  }

  @ApiOperation({ summary: 'plc의 데이터 입력' })
  @Post('/plc')
  createByPlc(@Body() body: AmrRawDto) {
    return this.amrService.createAmrByPlcData(body);
  }

  @Get()
  findAll() {
    return this.amrService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.amrService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAmrDto: UpdateAmrDto) {
    return this.amrService.update(+id, updateAmrDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.amrService.remove(+id);
  }
}
