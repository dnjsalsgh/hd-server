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
import { Vms } from '../vms/entities/vms.entity';
import { Vms2d } from '../vms2d/entities/vms2d.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AwbGroup, Awb, AwbSccJoin, Scc]),
    TypeOrmModule.forFeature([Vms, Vms2d], 'mssqlDB'),
    MulterModule.register({ dest: './upload' }),
    // mqtt 모듈설정
    MqttModule,
  ],
  controllers: [AwbGroupController],
  providers: [AwbGroupService, FileService, AwbService, SccService],
})
export class AwbGroupModule {}
