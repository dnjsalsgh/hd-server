import { Module } from '@nestjs/common';
import { SkidPlatformHistoryService } from './skid-platform-history.service';
import { SkidPlatformHistoryController } from './skid-platform-history.controller';
import { SkidPlatformHistory } from './entities/skid-platform-history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SkidPlatformHistory])],
  controllers: [SkidPlatformHistoryController],
  providers: [SkidPlatformHistoryService],
})
export class SkidPlatformHistoryModule {}
