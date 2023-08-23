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
import { CommonCodeService } from './common-code.service';
import { CreateCommonCodeDto } from './dto/create-common-code.dto';
import { UpdateCommonCodeDto } from './dto/update-common-code.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { CommonCode } from './entities/common-code.entity';
import { BasicqueryparamDto } from '../lib/dto/basicqueryparam.dto';

@Controller('common-code')
@ApiTags('[공통코드]common-code')
export class CommonCodeController {
  constructor(private readonly commonCodeService: CommonCodeService) {}

  @Post()
  create(@Body() createCommonCodeDto: CreateCommonCodeDto) {
    return this.commonCodeService.create(createCommonCodeDto);
  }

  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'code', required: false })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'createdAtFrom', required: false })
  @ApiQuery({ name: 'createdAtTo', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @Get()
  findAll(@Query() query: CommonCode & BasicqueryparamDto) {
    return this.commonCodeService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commonCodeService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommonCodeDto: UpdateCommonCodeDto,
  ) {
    return this.commonCodeService.update(+id, updateCommonCodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commonCodeService.remove(+id);
  }
}
