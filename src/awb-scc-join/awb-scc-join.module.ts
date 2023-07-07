import { Module } from '@nestjs/common';
import { AwbSccJoinService } from './awb-scc-join.service';
import { AwbSccJoinController } from './awb-scc-join.controller';
import { AwbSccJoin } from './entities/awb-scc-join.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AwbSccJoin])],
  controllers: [AwbSccJoinController],
  providers: [AwbSccJoinService],
})
export class AwbSccJoinModule {}
