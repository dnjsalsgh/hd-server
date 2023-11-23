import { Module } from '@nestjs/common';
import { BasicService } from './basic.service';
import { BasicController } from './basic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Basic } from './entities/basic.entity';
import { VmsAwbResult } from '../vms-awb-result/entities/vms-awb-result.entity';
import { VmsAwbHistory } from '../vms-awb-history/entities/vms-awb-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Basic]),
    TypeOrmModule.forFeature([VmsAwbResult, VmsAwbHistory], 'dimoaDB'),
  ],
  controllers: [BasicController],
  providers: [BasicService],
})
export class BasicModule {}
