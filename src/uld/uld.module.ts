import { Module } from '@nestjs/common';
import { UldService } from './uld.service';
import { UldController } from './uld.controller';
import { Uld } from './entities/uld.entity';

@Module({
  imports: [Uld],
  controllers: [UldController],
  providers: [UldService],
})
export class UldModule {}
