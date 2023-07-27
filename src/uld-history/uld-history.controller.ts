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
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AsrsHistory } from '../asrs-history/entities/asrs-history.entity';
import { BasicQueryParam } from '../lib/dto/basicQueryParam';
import { UldHistory } from './entities/uld-history.entity';

@Controller('uld-history')
@ApiTags('uld-history')
export class UldHistoryController {
  constructor(private readonly uldHistoryService: UldHistoryService) {}

  @Post()
  create(@Body() createUldHistoryDto: CreateUldHistoryDto) {
    return this.uldHistoryService.create(createUldHistoryDto);
  }

  @ApiQuery({ name: 'BuildUpOrder', required: false, type: 'number' })
  // @ApiQuery({ name: 'SkidPlatform', required: false, type: 'number' })
  // @ApiQuery({ name: 'Uld', required: false, type: 'number' })
  // @ApiQuery({ name: 'Awb', required: false, type: 'number' })
  @ApiQuery({ name: 'recommend', required: false, type: 'boolean' })
  @ApiQuery({ name: 'worker', required: false })
  @ApiQuery({ name: 'createdAtFrom', required: false })
  @ApiQuery({ name: 'createdAtTo', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @Get()
  findAll(@Query() query: UldHistory & BasicQueryParam) {
    return this.uldHistoryService.findAll(query);
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
