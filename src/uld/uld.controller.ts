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
import { UldService } from './uld.service';
import { CreateUldDto } from './dto/create-uld.dto';
import { UpdateUldDto } from './dto/update-uld.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { Uld } from './entities/uld.entity';
import { ManageUldCountDto } from './dto/manage-uld-count.dto';

@Controller('uld')
@ApiTags('[Uld]uld')
export class UldController {
  constructor(private readonly uldService: UldService) {}

  @Post()
  create(@Body() createUldDto: CreateUldDto) {
    return this.uldService.create(createUldDto);
  }

  @ApiQuery({ name: 'code', required: false })
  @ApiQuery({ name: 'airplaneType', required: false })
  @ApiQuery({ name: 'simulation', required: false })
  @ApiQuery({ name: 'UldType', required: false, type: 'number' })
  @ApiQuery({ name: 'AircraftSchedule', required: false, type: 'number' })
  @ApiQuery({ name: 'createdAtFrom', required: false })
  @ApiQuery({ name: 'createdAtTo', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @Get()
  findAll(@Query() query: Uld & BasicQueryParamDto) {
    return this.uldService.findAll(query);
  }

  @ApiOperation({
    summary:
      'uld 작업이 끝났다는 mqtt 신호를 보내주기 위함 토픽:(hyundai/work/complete)',
    description:
      '[목표] 모바일에서 uld가 끝났다는 신호를 mqtt로 쏘기 위한 api 입니다.',
  })
  @ApiQuery({ name: 'AircraftScheduleId', required: false })
  @Get('/complete')
  complete(@Query() query: ManageUldCountDto) {
    return this.uldService.complete(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uldService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUldDto: UpdateUldDto) {
    return this.uldService.update(+id, updateUldDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uldService.remove(+id);
  }
}
