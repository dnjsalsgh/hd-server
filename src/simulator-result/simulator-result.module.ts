import { Module } from '@nestjs/common';
import { SimulatorResultService } from './simulator-result.service';
import { SimulatorResultController } from './simulator-result.controller';
import { SimulatorResult } from './entities/simulator-result.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimulatorResultAwbJoin } from '../simulator-result-awb-join/entities/simulator-result-awb-join.entity';
import { SimulatorHistory } from '../simulator-history/entities/simulator-history.entity';
import { SkidPlatformHistory } from '../skid-platform-history/entities/skid-platform-history.entity';
import { AsrsHistory } from '../asrs-history/entities/asrs-history.entity';
import { AsrsOutOrder } from '../asrs-out-order/entities/asrs-out-order.entity';
import { BuildUpOrder } from '../build-up-order/entities/build-up-order.entity';
import { MqttModule } from '../mqtt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SimulatorResult,
      SimulatorHistory,
      // 안착대 이력을 가져오기 위함
      SkidPlatformHistory,
      // 창고 이력을 가져오기 위함
      AsrsHistory,
      // 자동창고 작업지시 만들기위함
      AsrsOutOrder,
      // 작업자 작업지시 만들기위함
      BuildUpOrder,
    ]),
    // mqtt 모듈설정
    MqttModule,
  ],
  controllers: [SimulatorResultController],
  providers: [SimulatorResultService],
})
export class SimulatorResultModule {}
