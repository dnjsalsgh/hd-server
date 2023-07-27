import { Module } from '@nestjs/common';
import { AwbSccJoinService } from './awb-scc-join.service';
import { AwbSccJoinController } from './awb-scc-join.controller';
import { AwbSccJoin } from './entities/awb-scc-join.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Awb } from '../awb/entities/awb.entity';
import { Scc } from '../scc/entities/scc.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AwbSccJoin, Awb, Scc])],
  controllers: [AwbSccJoinController],
  providers: [AwbSccJoinService],
})
export class AwbSccJoinModule {}
