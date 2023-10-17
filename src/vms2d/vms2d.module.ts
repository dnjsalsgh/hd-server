import { Module } from '@nestjs/common';
import { Vms2dService } from './vms2d.service';
import { Vms2dController } from './vms2d.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vms2d } from './entities/vms2d.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vms2d], 'mssqlDB')],
  controllers: [Vms2dController],
  providers: [Vms2dService],
  exports: [Vms2dModule],
})
export class Vms2dModule {}
