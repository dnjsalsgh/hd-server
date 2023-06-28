import { Module } from '@nestjs/common';
import { TimeTableService } from './time-table.service';
import { TimeTableController } from './time-table.controller';
import { TimeTable } from './entities/time-table.entity';

@Module({
  imports: [TimeTable],
  controllers: [TimeTableController],
  providers: [TimeTableService],
})
export class TimeTableModule {}
