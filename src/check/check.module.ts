import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vms3D } from '../vms/entities/vms.entity';
import { CheckController } from './check.controller';
import { MqttModule } from '../mqtt.module';
import { MqttService } from '../mqtt.service';
import { VmsAwbResult } from '../vms-awb-result/entities/vms-awb-result.entity';
import { VmsAwbHistory } from '../vms-awb-history/entities/vms-awb-history.entity';
import { Hacs } from '../hacs/entities/hacs.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vms3D], 'mssqlDB'),
    TypeOrmModule.forFeature([VmsAwbResult, VmsAwbHistory], 'dimoaDB'),
    TypeOrmModule.forFeature([Hacs], 'amrDB'),
    MqttModule,
  ],

  controllers: [CheckController],
  providers: [MqttService],
})
export class CheckModule {}
