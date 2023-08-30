import { Module } from '@nestjs/common';
import { UldTypeService } from './uld-type.service';
import { UldTypeController } from './uld-type.controller';
import { UldType } from './entities/uld-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { FileService } from '../file/file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UldType]),
    MulterModule.register({ dest: './upload' }),
  ],
  controllers: [UldTypeController],
  providers: [UldTypeService, FileService],
})
export class UldTypeModule {}
