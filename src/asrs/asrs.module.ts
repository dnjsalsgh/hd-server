import { Module } from '@nestjs/common';
import { AsrsService } from './asrs.service';
import { AsrsController } from './asrs.controller';
import { Asrs } from './entities/asrs.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MqttModule } from '../mqtt.module';
import { AsrsHistory } from '../asrs-history/entities/asrs-history.entity';
import { TimeTable } from '../time-table/entities/time-table.entity';
import { SkidPlatformHistoryService } from '../skid-platform-history/skid-platform-history.service';
import { SkidPlatformHistory } from '../skid-platform-history/entities/skid-platform-history.entity';
import { AsrsOutOrder } from '../asrs-out-order/entities/asrs-out-order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Asrs,
      AsrsHistory,
      TimeTable,
      SkidPlatformHistory,
      AsrsOutOrder,
    ]),
    // mqtt 모듈설정
    MqttModule,
  ],
  controllers: [AsrsController],
  providers: [AsrsService, SkidPlatformHistoryService],
})
export class AsrsModule {}
