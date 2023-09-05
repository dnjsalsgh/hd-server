import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vms } from '../vms/entities/vms.entity';
import { CheckController } from './check.controller';
import { MqttModule } from '../mqtt.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vms], 'mssqlDB'), MqttModule],
  controllers: [CheckController],
  providers: [],
})
export class CheckModule {}
