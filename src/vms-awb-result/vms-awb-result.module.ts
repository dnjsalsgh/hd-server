import { Module } from '@nestjs/common';
import { VmsAwbResultService } from './vms-awb-result.service';
import { VmsAwbResultController } from './vms-awb-result.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VmsAwbResult } from './entities/vms-awb-result.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VmsAwbResult], 'mssqlDB')],
  controllers: [VmsAwbResultController],
  providers: [VmsAwbResultService],
})
export class VmsAwbResultModule {}
