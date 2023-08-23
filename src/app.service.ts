import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as console from 'console';

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
  // @Cron('10 * * * * *')
  // handleCron() {
  //   console.log('Called when the current second is 10');
  // }

  // async onModuleInit() {
  //   this.startTimer(); // 서버가 시작될 때 타이머를 시작합니다.
  // }
  //
  // performAction() {
  //   console.log('Performing the action...');
  //   this.resetTimer(); // 행위가 실행되면 타이머를 초기화합니다.
  // }
  //
  // startTimer() {
  //   this.interval = setInterval(() => {
  //     this.performAction();
  //     // }, 10 * 60 * 1000); // 10분마다 행위 실행
  //   }, 10 * 1000); // 10분마다 행위 실행
  // }
  //
  // resetTimer() {
  //   if (this.interval) {
  //     clearInterval(this.interval); // 이전 타이머를 취소합니다.
  //     this.startTimer(); // 새로운 타이머를 시작합니다.
  //   }
  // }
}
