import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { AwbReturnService } from './awb-return.service';
import { CreateAwbReturnDto } from './dto/create-awb-return.dto';
import { UpdateAwbReturnDto } from './dto/update-awb-return.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AwbReturn } from './entities/awb-return.entity';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';

@ApiTags('[반송화물]Awb-return')
@Controller('awb-return')
export class AwbReturnController {
  constructor(private readonly awbReturnService: AwbReturnService) {}

  @ApiOperation({
    summary: '반송화물 등록',
    description: '반송화물 등록합니다.',
  })
  @Post()
  create(@Body() createAwbReturnDto: CreateAwbReturnDto) {
    return this.awbReturnService.create(createAwbReturnDto);
  }

  @ApiQuery({ name: 'createdAtTo', required: false })
  @ApiQuery({ name: 'createdAtFrom', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @Get()
  findAll(@Query() query: AwbReturn & BasicQueryParamDto) {
    return this.awbReturnService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.awbReturnService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateAwbReturnDto: UpdateAwbReturnDto,
  ) {
    return this.awbReturnService.update(+id, updateAwbReturnDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.awbReturnService.remove(+id);
  }
}
