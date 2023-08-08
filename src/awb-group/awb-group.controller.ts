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
import { AwbGroupService } from './awb-group.service';
import { CreateAwbGroupDto } from './dto/create-awb-group.dto';
import { UpdateAwbGroupDto } from './dto/update-awb-group.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { BasicQueryParam } from '../lib/dto/basicQueryParam';
import { AwbGroup } from './entities/awb-group.entity';

@Controller('Awb-group')
@ApiTags('[화물그룹]Awb-group')
export class AwbGroupController {
  constructor(private readonly awbGroupService: AwbGroupService) {}

  @Post()
  create(@Body() createAwbGroupDto: CreateAwbGroupDto) {
    return this.awbGroupService.create(createAwbGroupDto);
  }
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'code', required: false })
  @ApiQuery({ name: 'createdAtFrom', required: false })
  @ApiQuery({ name: 'createdAtTo', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @Get()
  findAll(@Query() query: AwbGroup & BasicQueryParam) {
    return this.awbGroupService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.awbGroupService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCargoGroupDto: UpdateAwbGroupDto,
  ) {
    return this.awbGroupService.update(+id, updateCargoGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.awbGroupService.remove(+id);
  }
}
