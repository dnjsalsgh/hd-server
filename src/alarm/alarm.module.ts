import { Module } from '@nestjs/common';
import { AlarmService } from './alarm.service';
import { AlarmController } from './alarm.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MqttModule } from '../mqtt.module';
import { Alarm } from './entities/alarm.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Alarm]),
    // mqtt 모듈설정
    MqttModule,
  ],
  controllers: [AlarmController],
  providers: [AlarmService],
})
export class AlarmModule {}
