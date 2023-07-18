import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SkidPlatformHistoryService } from './skid-platform-history.service';
import { CreateSkidPlatformHistoryDto } from './dto/create-skid-platform-history.dto';
import { UpdateSkidPlatformHistoryDto } from './dto/update-skid-platform-history.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateSkidPlatformAndAsrsPlcDto } from './dto/plc-data-intersection.dto';

@Controller('skid-platform-history')
@ApiTags('skid-platform-history')
export class SkidPlatformHistoryController {
  constructor(
    private readonly skidPlatformHistoryService: SkidPlatformHistoryService,
  ) {}

  @Post()
  create(@Body() createSkidPlatformHistoryDto: CreateSkidPlatformHistoryDto) {
    return this.skidPlatformHistoryService.create(createSkidPlatformHistoryDto);
  }

  @Get()
  findAll() {
    return this.skidPlatformHistoryService.findAll();
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
