import { Module } from '@nestjs/common';
import { AwbGroupService } from './awb-group.service';
import { AwbGroupController } from './awb-group.controller';
import { AwbGroup } from './entities/awb-group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwbService } from '../awb/awb.service';
import { Awb } from '../awb/entities/awb.entity';
import { Scc } from '../scc/entities/scc.entity';
import { AwbSccJoin } from '../awb-scc-join/entities/awb-scc-join.entity';
import { MulterModule } from '@nestjs/platform-express';
import { MqttModule } from '../mqtt.module';
import { FileService } from '../file/file.service';
import { SccService } from '../scc/scc.service';
import { Vms3D } from '../vms/entities/vms.entity';
import { Vms2d } from '../vms2d/entities/vms2d.entity';
import { Basic } from '../basic/entities/basic.entity';
import { AwbUtilService } from '../awb/awbUtil.service';
import { VmsAwbResult } from '../vms-awb-result/entities/vms-awb-result.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AwbGroup, Awb, AwbSccJoin, Scc, Basic]),
    TypeOrmModule.forFeature([Vms3D, Vms2d], 'mssqlDB'),
    TypeOrmModule.forFeature([VmsAwbResult], 'dimoaDB'),
    MulterModule.register({ dest: './upload' }),
    // mqtt 모듈설정
    MqttModule,
  ],
  controllers: [AwbGroupController],
  providers: [
    AwbGroupService,
    FileService,
    AwbService,
    SccService,
    AwbUtilService,
  ],
})
export class AwbGroupModule {}
