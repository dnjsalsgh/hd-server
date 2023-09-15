import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AmrChargerService } from './amr-charger.service';
import { CreateAmrChargerDto } from './dto/create-amr-charger.dto';
import { UpdateAmrChargerDto } from './dto/update-amr-charger.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { AmrCharger } from './entities/amr-charger.entity';

@Controller('amr-charger')
@ApiTags('[Amr 충전기]amr-charge')
export class AmrChargerController {
  constructor(private readonly amrChargerService: AmrChargerService) {}

  @ApiOperation({
    summary: '[사용x] amr 데이터 입력시 자동으로 등록됨',
    description: 'amr, amrCharge, amrChargeHistory 모두 등록함',
  })
  @Post()
  create(@Body() createAmrChargerDto: CreateAmrChargerDto) {
    return this.amrChargerService.create(createAmrChargerDto);
  }

  @ApiQuery({ name: 'name', required: false, type: 'string' })
  @ApiQuery({ name: 'working', required: false, type: 'boolean' })
  @ApiQuery({ name: 'x', required: false, type: 'number' })
  @ApiQuery({ name: 'y', required: false, type: 'number' })
  @ApiQuery({ name: 'z', required: false, type: 'number' })
  @ApiQuery({ name: 'createdAtFrom', required: false })
  @ApiQuery({ name: 'createdAtTo', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @Get()
  findAll(
    @Query()
    query: AmrCharger & BasicQueryParamDto,
  ) {
    return this.amrChargerService.findAll(query);
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
