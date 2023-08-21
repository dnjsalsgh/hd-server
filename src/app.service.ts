import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  /**
   * * * * * * *
   * | | | | | |
   * | | | | | day of week
   * | | | | months
   * | | | day of month
   * | | hours
   * | minutes
   * seconds (optional)
   */
  // scheduler를 태스트 하기 위한 것
  // @Cron('45 * * * * *')
  // handleCron() {
  //   console.log('Called when the current second is 45');
  // }
}
