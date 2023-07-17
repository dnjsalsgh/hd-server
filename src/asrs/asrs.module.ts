import { Module } from '@nestjs/common';
import { AsrsService } from './asrs.service';
import { AsrsController } from './asrs.controller';
import { Asrs } from './entities/asrs.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MqttModule } from '../mqtt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asrs]),
    // mqtt 모듈설정
    MqttModule,
  ],
  controllers: [AsrsController],
  providers: [AsrsService],
})
export class AsrsModule {}
