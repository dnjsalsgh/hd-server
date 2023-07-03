import { Module } from '@nestjs/common';
import { UldSccJoinService } from './uld-scc-join.service';
import { UldSccJoinController } from './uld-scc-join.controller';
import { UldSccJoin } from './entities/uld-scc-join.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UldSccJoin])],
  controllers: [UldSccJoinController],
  providers: [UldSccJoinService],
})
export class UldSccJoinModule {}
