import { Module } from '@nestjs/common';
import { TempStorageService } from './temp-storage.service';
import { TempStorageController } from './temp-storage.controller';
import { TempStorage } from './entities/temp-storage.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TempStorage])],
  controllers: [TempStorageController],
  providers: [TempStorageService],
})
export class TempStorageModule {}
