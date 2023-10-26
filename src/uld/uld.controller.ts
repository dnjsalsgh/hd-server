import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
import { UldSccInjectionDto } from './dto/uld-sccInjection.dto';

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
  @Get('/complete')
  complete() {
    return this.uldService.complete();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uldService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUldDto: UpdateUldDto) {
    return this.uldService.update(+id, updateUldDto);
  }

  @ApiOperation({
    summary: '기존에 있는 uld에 scc 주입하기',
    description:
      '[사용법] param에는 uld id를 넣고 body에 scc의 id를 배열로 넣어야 합니다.\n' +
      '[목표] uld에 화물이 들어가면 화물안에 있는 scc로 uld의 scc를 바로 주입하는 것을 목표로합니다.',
  })
  @Put('inject-scc/:id')
  injectionScc(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UldSccInjectionDto,
  ) {
    return this.uldService.injectionScc(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uldService.remove(+id);
  }
}
