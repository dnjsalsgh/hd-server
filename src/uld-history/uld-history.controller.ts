import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UldHistoryService } from './uld-history.service';
import { CreateUldHistoryDto } from './dto/create-uld-history.dto';
import { UpdateUldHistoryDto } from './dto/update-uld-history.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { UldHistory } from './entities/uld-history.entity';
import { TransactionInterceptor } from '../lib/interceptor/transaction.interfacepter';
import { TransactionManager } from '../lib/decorator/transaction.decorator';
import { EntityManager } from 'typeorm';

@Controller('uld-history')
@ApiTags('[Uld 이력]uld-history')
export class UldHistoryController {
  constructor(private readonly uldHistoryService: UldHistoryService) {}

  @ApiOperation({
    summary: 'uld 안에 화물이 입력되면 호출하는 api',
    description: '[사용법] Uld: 목표 uldId, Awb: 사용된 awbId',
  })
  @UseInterceptors(TransactionInterceptor)
  @Post()
  create(
    @Body() createUldHistoryDto: CreateUldHistoryDto,
    @TransactionManager() queryRunnerManager: EntityManager,
  ) {
    return this.uldHistoryService.create(
      createUldHistoryDto,
      queryRunnerManager,
    );
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
