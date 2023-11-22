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
import { AsrsHistoryService } from './asrs-history.service';
import { CreateAsrsHistoryDto } from './dto/create-asrs-history.dto';
import { UpdateAsrsHistoryDto } from './dto/update-asrs-history.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { AsrsHistory } from './entities/asrs-history.entity';

@Controller('asrs-history')
@ApiTags('[창고 히스토리]asrs-history')
export class AsrsHistoryController {
  constructor(private readonly asrsHistoryService: AsrsHistoryService) {}

  @Post()
  create(@Body() createAsrsHistoryDto: CreateAsrsHistoryDto) {
    return this.asrsHistoryService.create(createAsrsHistoryDto);
  }

  @ApiOperation({
    summary: '[태스트용] 창고의 이력을 list 형태로 넣기 위함',
    description: '창고의 이력을 list 형태로 넣기 위함',
  })
  @Post('/list')
  async createList(@Body() createAsrsHistoryDtos: CreateAsrsHistoryDto[]) {
    const insertResultList = await this.asrsHistoryService.createList(
      createAsrsHistoryDtos,
    );
    return insertResultList;
  }

  @ApiQuery({ name: 'Asrs', required: false, type: 'number' })
  @ApiQuery({ name: 'Awb', required: false, type: 'number' })
  @ApiQuery({ name: 'createdAtFrom', required: false })
  @ApiQuery({ name: 'createdAtTo', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @Get()
  findAll(@Query() query: AsrsHistory & BasicQueryParamDto) {
    return this.asrsHistoryService.findAll(query);
  }

  @ApiOperation({
    summary: '창고의 이력 최신본 삭제',
    description: '창고의 이력 최신본 삭제',
  })
  @Post('/reset')
  resetAsrs() {
    return this.asrsHistoryService.resetAsrs();
  }

  @ApiOperation({
    summary: '창고의 이력 삭제',
    description: '창고의 이력 삭제',
  })
  @Delete('/reset-all')
  resetAsrsAll() {
    return this.asrsHistoryService.resetAsrsAll();
  }

  @ApiOperation({
    summary: '창고의 현재 상태를 가져오기',
    description: '창고id로 이력의 최신본만 가져오기',
  })
  @Get('/now')
  StatusOfAsrs() {
    return this.asrsHistoryService.nowState();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.asrsHistoryService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateAsrsHistoryDto: UpdateAsrsHistoryDto,
  ) {
    return this.asrsHistoryService.update(+id, updateAsrsHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.asrsHistoryService.remove(+id);
  }
}
