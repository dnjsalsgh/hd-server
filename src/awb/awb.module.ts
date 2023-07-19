import { Module } from '@nestjs/common';
import { AwbService } from './awb.service';
import { AwbController } from './awb.controller';
import { Awb } from './entities/awb.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwbSccJoin } from '../awb-scc-join/entities/awb-scc-join.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Awb, AwbSccJoin]),
    MulterModule.register({ dest: './upload' }),
  ],
  controllers: [AwbController],
  providers: [AwbService],
})
export class AwbModule {}
