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
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { BasicqueryparamDto } from '../lib/dto/basicqueryparam.dto';
import { AsrsHistory } from './entities/asrs-history.entity';

@Controller('asrs-history')
@ApiTags('[창고 히스토리]asrs-history')
export class AsrsHistoryController {
  constructor(private readonly asrsHistoryService: AsrsHistoryService) {}

  @Post()
  create(@Body() createAsrsHistoryDto: CreateAsrsHistoryDto) {
    return this.asrsHistoryService.create(createAsrsHistoryDto);
  }

  @ApiQuery({ name: 'Asrs', required: false, type: 'number' })
  @ApiQuery({ name: 'Awb', required: false, type: 'number' })
  @ApiQuery({ name: 'createdAtFrom', required: false })
  @ApiQuery({ name: 'createdAtTo', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @Get()
  findAll(@Query() query: AsrsHistory & BasicqueryparamDto) {
    return this.asrsHistoryService.findAll(query);
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
