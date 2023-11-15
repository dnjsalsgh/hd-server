import { Module } from '@nestjs/common';
import { UldHistoryService } from './uld-history.service';
import { UldHistoryController } from './uld-history.controller';
import { UldHistory } from './entities/uld-history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Uld } from '../uld/entities/uld.entity';
import { MqttModule } from '../mqtt.module';
import { UldService } from '../uld/uld.service';
import { UldType } from '../uld-type/entities/uld-type.entity';
import { UldSccJoin } from '../uld-scc-join/entities/uld-scc-join.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UldHistory, Uld, UldType, UldSccJoin]),
    MqttModule,
  ],
  controllers: [UldHistoryController],
  providers: [UldHistoryService, UldService],
})
export class UldHistoryModule {}
