import { Module } from '@nestjs/common';
import { AsrsService } from './asrs.service';
import { AsrsController } from './asrs.controller';
import { Asrs } from './entities/asrs.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MqttModule } from '../mqtt.module';
import { AsrsHistory } from '../asrs-history/entities/asrs-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asrs, AsrsHistory]),
    // mqtt 모듈설정
    MqttModule,
  ],
  controllers: [AsrsController],
  providers: [AsrsService],
})
export class AsrsModule {}
