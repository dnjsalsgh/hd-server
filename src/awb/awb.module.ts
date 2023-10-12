import { Module } from '@nestjs/common';
import { AwbService } from './awb.service';
import { AwbController } from './awb.controller';
import { Awb } from './entities/awb.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwbSccJoin } from '../awb-scc-join/entities/awb-scc-join.entity';
import { MulterModule } from '@nestjs/platform-express';
import { Scc } from '../scc/entities/scc.entity';
import { MqttModule } from '../mqtt.module';
import { FileService } from '../file/file.service';
import { Vms } from '../vms/entities/vms.entity';
import { MqttService } from '../mqtt.service';
import { SccService } from '../scc/scc.service';
import { SccModule } from '../scc/scc.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Awb, AwbSccJoin, Scc]),
    TypeOrmModule.forFeature([Vms], 'mssqlDB'),
    MulterModule.register({ dest: './upload' }),
    // mqtt 모듈설정
    MqttModule,
  ],
  controllers: [AwbController],
  providers: [AwbService, FileService, MqttService, SccService],
})
export class AwbModule {}
