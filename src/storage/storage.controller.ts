import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
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
  async create(@Body() body: CreateStorageDto) {
    // parent 정보 확인
    if (typeof body.parent === 'number' && body.parent < 0) {
      throw new HttpException('parent 정보를 정확히 입력해주세요', 400);
    }

    body.parent = typeof body.parent === 'number' ? body.parent : 0;
    body.fullPath = body.name;
    const storage = await this.storageService.create(body);
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
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStorageDto: UpdateStorageDto,
  ) {
    return this.storageService.update(id, updateStorageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storageService.remove(+id);
  }
}
