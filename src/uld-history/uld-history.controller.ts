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
import { UldHistoryService } from './uld-history.service';
import { CreateUldHistoryDto } from './dto/create-uld-history.dto';
import { UpdateUldHistoryDto } from './dto/update-uld-history.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { UldHistory } from './entities/uld-history.entity';

@Controller('uld-history')
@ApiTags('[Uld 이력]uld-history')
export class UldHistoryController {
  constructor(private readonly uldHistoryService: UldHistoryService) {}

  @ApiOperation({
    summary: 'uld 안에 화물이 입력되면 호출하는 api',
    description: '[사용법] Uld: 목표 uldId, Awb: 사용된 awbId',
  })
  @Post()
  create(@Body() createUldHistoryDto: CreateUldHistoryDto) {
    return this.uldHistoryService.create(createUldHistoryDto);
  }

  @ApiOperation({
    summary: '[태스트용] uld의 이력을 list 형태로 넣기 위함',
    description: 'uld의 이력을 list 형태로 넣기 위함',
  })
  @Post('/list')
  createList(@Body() createUldHistoryDto: CreateUldHistoryDto[]) {
    return this.uldHistoryService.createList(createUldHistoryDto);
  }

  @ApiQuery({ name: 'BuildUpOrder', required: false, type: 'number' })
  @ApiQuery({ name: 'SkidPlatform', required: false, type: 'number' })
  @ApiQuery({ name: 'Uld', required: false, type: 'number' })
  @ApiQuery({ name: 'Awb', required: false, type: 'number' })
  @ApiQuery({ name: 'recommend', required: false, type: 'boolean' })
  @ApiQuery({ name: 'worker', required: false })
  @ApiQuery({ name: 'createdAtFrom', required: false })
  @ApiQuery({ name: 'createdAtTo', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @Get()
  findAll(@Query() query: UldHistory & BasicQueryParamDto) {
    return this.uldHistoryService.findAll(query);
  }

  @ApiOperation({
    summary: 'Uld의 현재 상태를 가져오기',
    description: 'uld code 로 이력의 최신본만 가져오기',
  })
  @Get('/now')
  StatusOfUld(@Query('uldCode') uldCode: string) {
    return this.uldHistoryService.nowState(uldCode);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uldHistoryService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUldHistoryDto: UpdateUldHistoryDto,
  ) {
    return this.uldHistoryService.update(+id, updateUldHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uldHistoryService.remove(+id);
  }
}
