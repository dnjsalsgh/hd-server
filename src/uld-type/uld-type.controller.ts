import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UldTypeService } from './uld-type.service';
import { CreateUldTypeDto } from './dto/create-uld-type.dto';
import { UpdateUldTypeDto } from './dto/update-uld-type.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { UldType } from './entities/uld-type.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('uld-type')
@ApiTags('[Uld 타입]uld-type')
export class UldTypeController {
  constructor(private readonly uldTypeService: UldTypeService) {}

  @Post()
  create(@Body() createUldTypeDto: CreateUldTypeDto) {
    return this.uldTypeService.create(createUldTypeDto);
  }

  @ApiOperation({
    summary: 'uld-type의 code가 중복었다면 update, 없다면 insert',
  })
  @Post('/upsert')
  upsert(@Body() createUldTypeDto: CreateUldTypeDto) {
    return this.uldTypeService.upsert(createUldTypeDto);
  }

  @ApiQuery({ name: 'code', required: false })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'createdAtFrom', required: false })
  @ApiQuery({ name: 'createdAtTo', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @Get()
  findAll(@Query() query: UldType & BasicQueryParamDto) {
    return this.uldTypeService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uldTypeService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUldTypeDto: UpdateUldTypeDto) {
    return this.uldTypeService.update(+id, updateUldTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uldTypeService.remove(+id);
  }

  @ApiOperation({
    summary: 'uld-type에 file(png)을 upload 하기',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Put('file/:id/')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.uldTypeService.upload(id, file);
  }
}
