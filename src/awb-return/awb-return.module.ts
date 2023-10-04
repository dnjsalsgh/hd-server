import { Module } from '@nestjs/common';
import { AwbReturnService } from './awb-return.service';
import { AwbReturnController } from './awb-return.controller';
import { AwbReturn } from './entities/awb-return.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AwbReturn])],
  controllers: [AwbReturnController],
  providers: [AwbReturnService],
})
export class AwbReturnModule {}
