import { Module } from '@nestjs/common';
import { UldTypeService } from './uld-type.service';
import { UldTypeController } from './uld-type.controller';
import { UldType } from './entities/uld-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UldType])],
  controllers: [UldTypeController],
  providers: [UldTypeService],
})
export class UldTypeModule {}
