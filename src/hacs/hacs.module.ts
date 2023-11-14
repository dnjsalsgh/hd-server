import { Module } from '@nestjs/common';
import { HacsService } from './hacs.service';
import { HacsController } from './hacs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hacs } from './entities/hacs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hacs], 'amrDB')],
  controllers: [HacsController],
  providers: [HacsService],
})
export class HacsModule {}
