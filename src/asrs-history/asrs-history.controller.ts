import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { AsrsHistoryService } from './asrs-history.service';
import { CreateAsrsHistoryDto } from './dto/create-asrs-history.dto';
import { UpdateAsrsHistoryDto } from './dto/update-asrs-history.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('Asrs-history')
@ApiTags('Asrs-history')
export class AsrsHistoryController {
  constructor(private readonly asrsHistoryService: AsrsHistoryService) {}

  @Post()
  create(@Body() createAsrsHistoryDto: CreateAsrsHistoryDto) {
    return this.asrsHistoryService.create(createAsrsHistoryDto);
  }

  @Get()
  findAll() {
    return this.asrsHistoryService.findAll();
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
