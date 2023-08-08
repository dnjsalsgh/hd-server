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
import { SkidPlatformHistoryService } from './skid-platform-history.service';
import { CreateSkidPlatformHistoryDto } from './dto/create-skid-platform-history.dto';
import { UpdateSkidPlatformHistoryDto } from './dto/update-skid-platform-history.dto';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateSkidPlatformAndAsrsPlcDto } from './dto/plc-data-intersection.dto';
import { BasicQueryParam } from '../lib/dto/basicQueryParam';
import { SkidPlatformHistory } from './entities/skid-platform-history.entity';

@Controller('skid-platform-history')
@ApiTags('[안착대 이력]skid-platform-history')
export class SkidPlatformHistoryController {
  constructor(
    private readonly skidPlatformHistoryService: SkidPlatformHistoryService,
  ) {}

  @Post()
  create(@Body() createSkidPlatformHistoryDto: CreateSkidPlatformHistoryDto) {
    return this.skidPlatformHistoryService.create(createSkidPlatformHistoryDto);
  }

  @ApiQuery({ name: 'Awb', required: false, type: 'number' })
  @ApiQuery({ name: 'Asrs', required: false, type: 'number' })
  @ApiQuery({ name: 'SkidPlatform', required: false, type: 'number' })
  @ApiQuery({ name: 'AsrsOutOrder', required: false, type: 'number' })
  @ApiQuery({ name: 'createdAtFrom', required: false })
  @ApiQuery({ name: 'createdAtTo', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @Get()
  findAll(@Query() query: SkidPlatformHistory & BasicQueryParam) {
    return this.skidPlatformHistoryService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skidPlatformHistoryService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateSkidPlatformHistoryDto: UpdateSkidPlatformHistoryDto,
  ) {
    return this.skidPlatformHistoryService.update(
      +id,
      updateSkidPlatformHistoryDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.skidPlatformHistoryService.remove(+id);
  }

  @ApiOperation({
    summary:
      'plc의 데이터중 안착대 화물정보가 변경되었을 때 안착대 이력을 등록하기 위함.',
    description: '안착대 화물정보가 변경 시 동작',
  })
  @ApiBody({ type: CreateSkidPlatformAndAsrsPlcDto })
  @Post('/plc')
  checkSkidPlatformChange(@Body() body: CreateSkidPlatformAndAsrsPlcDto) {
    return this.skidPlatformHistoryService.checkSkidPlatformChange(body);
  }
}
