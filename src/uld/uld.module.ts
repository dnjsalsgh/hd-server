import { Module } from '@nestjs/common';
import { UldService } from './uld.service';
import { UldController } from './uld.controller';
import { Uld } from './entities/uld.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UldSccJoin } from '../uld-scc-join/entities/uld-scc-join.entity';
import { UldType } from '../uld-type/entities/uld-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Uld, UldType, UldSccJoin])],
  controllers: [UldController],
  providers: [UldService],
})
export class UldModule {}
