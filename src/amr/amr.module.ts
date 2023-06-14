import { Module } from '@nestjs/common';
import { AmrService } from './amr.service';
import { AmrController } from './amr.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Amr } from './entities/amr.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Amr])],
  controllers: [AmrController],
  providers: [AmrService],
})
export class AmrModule {}
