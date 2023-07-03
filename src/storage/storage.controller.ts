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
  async create(@Body() createStorageDto: CreateStorageDto) {
    const storage = await this.storageService.create(createStorageDto);
    return storage;
  }

  @Get()
  async findAll() {
    const storage = await this.storageService.findAll();
    return storage;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.storageService.findOne(+id);
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
