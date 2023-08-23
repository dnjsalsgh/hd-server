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
import { BasicqueryparamDto } from '../lib/dto/basicqueryparam.dto';
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
  @ApiQuery({ name: 'createdAtFrom', required: false })
  @ApiQuery({ name: 'createdAtTo', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @Get()
  findAll(@Query() query: Uld & BasicqueryparamDto) {
    return this.uldService.findAll(query);
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

  @ApiOperation({
    summary: '[이건 테스트용입니다]기존에 있는 uld에 scc 주입하기',
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
}
