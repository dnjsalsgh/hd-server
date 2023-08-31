import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AmrService } from '../amr/amr.service';

@Injectable()
export class WorkerService {
  constructor(private readonly amrService: AmrService) {}
  @Cron('*/10 * * * * *', {
    name: 'amrCronJobTest',
    timeZone: 'Asia/Seoul',
  })
  InitialScheduler() {
    const min = 5;
    const max = 10;
    const randomInRange = Math.random() * (max - min) + min; // min 이상 max 미만의 난수를 반환
    // this.amrService.createAmrByMssql();
    // return this.amrService.createAmrByMssql();
  }
}
