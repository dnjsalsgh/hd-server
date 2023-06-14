import { Module } from '@nestjs/common';
import { SccService } from './scc.service';
import { SccController } from './scc.controller';
import { Scc } from './entities/scc.entity';

@Module({
  imports: [Scc],
  controllers: [SccController],
  providers: [SccService],
})
export class SccModule {}
