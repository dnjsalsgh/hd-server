import { Module } from '@nestjs/common';
import { SccService } from './scc.service';
import { SccController } from './scc.controller';
import { Scc } from './entities/scc.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Basic } from '../basic/entities/basic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Scc, Basic])],
  controllers: [SccController],
  providers: [SccService],
})
export class SccModule {}
