import { Module } from '@nestjs/common';
import { AmrService } from './amr.service';
import { AmrController } from './amr.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Amr } from './entities/amr.entity';
import { AmrCharger } from '../amr-charger/entities/amr-charger.entity';
import { AmrChargeHistory } from '../amr-charge-history/entities/amr-charge-history.entity';
import { MqttModule } from '../mqtt.module';
import { Hacs } from '../hacs/entities/hacs.entity';
import { LoggerService } from '../lib/logger/logger.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Amr, AmrCharger, AmrChargeHistory]),
    TypeOrmModule.forFeature([Hacs], 'amrDB'),
    // mqtt 모듈설정
    MqttModule,
  ],
  controllers: [AmrController],
  providers: [
    AmrService,
    LoggerService,
    {
      provide: 'SERVICE_NAME', // 여기에서 프로바이더 이름을 지정합니다.
      useValue: 'AmrService', // 원하는 값을 useValue로 지정합니다.
    },
  ],
})
export class AmrModule {}
