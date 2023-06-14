import { Module } from '@nestjs/common';
import { UldSccJoinService } from './uld-scc-join.service';
import { UldSccJoinController } from './uld-scc-join.controller';
import { UldSccJoin } from './entities/uld-scc-join.entity';

@Module({
  imports: [UldSccJoin],
  controllers: [UldSccJoinController],
  providers: [UldSccJoinService],
})
export class UldSccJoinModule {}
