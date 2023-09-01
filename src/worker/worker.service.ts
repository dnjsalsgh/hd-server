import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AmrService } from '../amr/amr.service';
import { LoggerService } from '../lib/logger/logger.service';

@Injectable()
export class WorkerService {
  constructor(
    private readonly amrService: AmrService,
    private readonly loggerService: LoggerService,
  ) {}
  @Cron('*/10 * * * * *', {
    name: 'amrCronJobTest',
    timeZone: 'Asia/Seoul',
  })
  InitialScheduler() {
    //주석 해제 하면 mssql에서 amr 정보 가져오는 스케줄러 동작
    // this.amrService.createAmrByMssql();
  }
}
