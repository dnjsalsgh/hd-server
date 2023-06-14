import { Module } from '@nestjs/common';
import { UldTypeService } from './uld-type.service';
import { UldTypeController } from './uld-type.controller';
import { UldType } from './entities/uld-type.entity';

@Module({
  imports: [UldType],
  controllers: [UldTypeController],
  providers: [UldTypeService],
})
export class UldTypeModule {}
