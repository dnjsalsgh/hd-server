import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SkidPlatformService } from './skid-platform.service';
import { CreateSkidPlatformDto } from './dto/create-skid-platform.dto';
import { UpdateSkidPlatformDto } from './dto/update-skid-platform.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateAsrsDto } from '../asrs/dto/create-asrs.dto';
import { Asrs } from '../asrs/entities/asrs.entity';
import { CreateAsrsPlcDto } from '../asrs/dto/create-asrs-plc.dto';

@Controller('skid-platform')
@ApiTags('skid-platform')
export class SkidPlatformController {
  constructor(private readonly skidPlatformService: SkidPlatformService) {}

  @ApiOperation({
    summary: 'skidPlatform(안착대) 생성 API',
    description: 'skidPlatform(안착대) 생성 한다',
  })
  @ApiBody({ type: CreateAsrsDto })
  @ApiCreatedResponse({ description: '안착대를 생성한다.', type: Asrs })
  @Post()
  create(@Body() body: CreateSkidPlatformDto) {
    // parent 정보 확인
    if (typeof body.parent === 'number' && body.parent < 0) {
      throw new HttpException('parent 정보를 정확히 입력해주세요', 400);
    }

    body.parent = typeof body.parent === 'number' ? body.parent : 0;
    body.fullPath = body.name;
    return this.skidPlatformService.create(body);
  }

  @ApiOperation({
    summary: 'plc를 활용한 창고의 화물을 안착대에 넣기(이력등록)',
  })
  @Post('/plc/asrs-out')
  createByPlcOut(@Body() body: CreateAsrsPlcDto) {
    return this.skidPlatformService.createByPlcOut(body);
  }

  @Get()
  findAll() {
    return this.skidPlatformService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skidPlatformService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateSkidPlatformDto: UpdateSkidPlatformDto,
  ) {
    return this.skidPlatformService.update(+id, updateSkidPlatformDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.skidPlatformService.remove(+id);
  }
}
