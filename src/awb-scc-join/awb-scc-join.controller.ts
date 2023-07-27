import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { AwbSccJoinService } from './awb-scc-join.service';
import { CreateAwbSccJoinDto } from './dto/create-awb-scc-join.dto';
import { UpdateAwbSccJoinDto } from './dto/update-awb-scc-join.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AsrsHistory } from '../asrs-history/entities/asrs-history.entity';
import { BasicQueryParam } from '../lib/dto/basicQueryParam';
import { AwbSccJoin } from './entities/awb-scc-join.entity';

@Controller('Awb-Scc-join')
@ApiTags('Awb-Scc-join')
export class AwbSccJoinController {
  constructor(private readonly awbSccJoinService: AwbSccJoinService) {}

  @Post()
  create(@Body() createAwbSccJoinDto: CreateAwbSccJoinDto) {
    return this.awbSccJoinService.create(createAwbSccJoinDto);
  }

  @ApiQuery({ name: 'Scc', required: false, type: 'number' })
  @ApiQuery({ name: 'Awb', required: false, type: 'number' })
  @ApiQuery({ name: 'createdAtFrom', required: false })
  @ApiQuery({ name: 'createdAtTo', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @Get()
  findAll(@Query() query: AwbSccJoin & BasicQueryParam) {
    return this.awbSccJoinService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.awbSccJoinService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCargoSccJoinDto: UpdateAwbSccJoinDto,
  ) {
    return this.awbSccJoinService.update(+id, updateCargoSccJoinDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.awbSccJoinService.remove(+id);
  }
}
