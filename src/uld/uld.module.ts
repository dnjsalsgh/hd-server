import { Module } from '@nestjs/common';
import { UldService } from './uld.service';
import { UldController } from './uld.controller';
import { Uld } from './entities/uld.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Uld])],
  controllers: [UldController],
  providers: [UldService],
})
export class UldModule {}
