import { Module } from '@nestjs/common';
import { AsrsService } from './asrs.service';
import { AsrsController } from './asrs.controller';
import { Asrs } from './entities/asrs.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Asrs])],
  controllers: [AsrsController],
  providers: [AsrsService],
})
export class AsrsModule {}
