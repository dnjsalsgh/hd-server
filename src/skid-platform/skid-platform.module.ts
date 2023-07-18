import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkidPlatform } from './entities/skid-platform.entity';
import { SkidPlatformController } from './skid-platform.controller';
import { SkidPlatformService } from './skid-platform.service';
import { SkidPlatformHistory } from '../skid-platform-history/entities/skid-platform-history.entity';
import { AsrsOutOrder } from '../asrs-out-order/entities/asrs-out-order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SkidPlatform, SkidPlatformHistory, AsrsOutOrder]),
  ],
  controllers: [SkidPlatformController],
  providers: [SkidPlatformService],
})
export class SkidPlatformModule {}
