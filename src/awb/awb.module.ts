import { Module } from '@nestjs/common';
import { AwbService } from './awb.service';
import { AwbController } from './awb.controller';
import { Awb } from './entities/awb.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwbSccJoin } from '../awb-scc-join/entities/awb-scc-join.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Awb, AwbSccJoin])],
  controllers: [AwbController],
  providers: [AwbService],
})
export class AwbModule {}
