import { Module } from '@nestjs/common';
import { StackerDataService } from './stacker-data.service';
import { StackerDataController } from './stacker-data.controller';
import { StackerData } from './entities/stacker-data.entity';

@Module({
  imports: [StackerData],
  controllers: [StackerDataController],
  providers: [StackerDataService],
})
export class StackerDataModule {}
