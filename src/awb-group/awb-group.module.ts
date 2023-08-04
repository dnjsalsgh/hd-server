import { Module } from '@nestjs/common';
import { AwbGroupService } from './awb-group.service';
import { AwbGroupController } from './awb-group.controller';
import { AwbGroup } from './entities/awb-group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AwbGroup])],
  controllers: [AwbGroupController],
  providers: [AwbGroupService],
})
export class AwbGroupModule {}
