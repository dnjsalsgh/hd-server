import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { StorageService } from './storage.service';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Storage } from './entities/storage.entity';
import {
  ApiJsonResponse,
  makeResponseTemplate,
  responseType,
} from '../lib/resUtil';

@Controller('storage')
@ApiTags('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  @ApiOperation({
    summary: 'VMS(화물측정시스템) 생성 API',
    description: 'VMS(화물측정시스템) 생성 한다',
  })
  @ApiBody({ type: CreateStorageDto })
  @ApiCreatedResponse({ description: '유저를 생성한다.', type: Storage })
  @ApiJsonResponse(responseType.REG)
  async create(
    @Body() createStorageDto: CreateStorageDto,
    // @Res() res: Response,
  ) {
    const storage = await this.storageService.create(createStorageDto);
    // const resJson = makeResponseTemplate(storage, responseType.REG);
    return storage;
  }

  @Get()
  async findAll() {
    const storage = await this.storageService.findAll();
    const resJson = {
      data: storage,
      message: 'Inserted Data succesfully',
    };
    return resJson;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storageService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateStorageDto: UpdateStorageDto) {
    return this.storageService.update(+id, updateStorageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storageService.remove(+id);
  }
}
