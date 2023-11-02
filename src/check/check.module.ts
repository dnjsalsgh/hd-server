import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vms3D } from '../vms/entities/vms.entity';
import { CheckController } from './check.controller';
import { MqttModule } from '../mqtt.module';
import { MqttService } from '../mqtt.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vms3D], 'mssqlDB'), MqttModule],
  controllers: [CheckController],
  providers: [MqttService],
})
export class CheckModule {}
