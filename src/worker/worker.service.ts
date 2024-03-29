import { Injectable } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { AmrService } from '../amr/amr.service';
import { LoggerService } from '../lib/logger/logger.service';
import { AwbService } from '../awb/awb.service';
import console from 'console';
import { FileService } from '../file/file.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WorkerService {
  constructor(
    private readonly amrService: AmrService,
    private readonly loggerService: LoggerService,
    private readonly awbService: AwbService,
    private readonly fileService: FileService,
    private readonly configService: ConfigService,
  ) {}

  @Interval(600)
  // 0.6 초마다 mssql 에서 amr 데이터를 가져옴
  InitialScheduler() {
    //주석 해제 하면 mssql에서 amr 정보 가져오는 스케줄러 동작
    if (this.configService.get<string>('SCHEDULE') !== 'true') {
      return;
    }
    this.amrService.createAmrByHacs();
    console.log('amr 데이터 수집 스케줄러 동작');
  }

  // awb의 누락된 모델링 파일을 다시 조립하기 위한 스케줄링
  // * 10 * * * *
  // every 10minute between 8am and 7pm
  // @Cron('* */10 8-19 * * *', {
  // @Cron('*/3 * * * *', {
  //   name: 'missingAWBModelingFileHandlingLogic',
  //   timeZone: 'Asia/Seoul',
  // })
  @Interval(6000) // 6초
  // 3d 모델 누락 스케줄러
  async missingAWBModelingFileHandlingLogic() {
    if (this.configService.get<string>('LOCAL_SCHEDULE') !== 'true') {
      return;
    }
    console.log('누락 3d파일 체크 스케줄러 동작함');
    // 화물 100개 limit 걸기
    const missingAwbs = await this.awbService.getAwbNotCombineModelPath(10);

    for (const missingAwb of missingAwbs) {
      const missingVms = await this.awbService.getAwbByVmsByName(
        missingAwb.barcode,
        missingAwb.separateNumber,
      );
      const missingVms2d = await this.awbService.getAwbByVms2dByName(
        missingAwb.barcode,
        missingAwb.separateNumber,
      );
      if (missingVms || missingVms2d) {
        // 누락 로직 돌고 있으니 모델링 누락 스케줄러 동작안해도됨
        await this.awbService.preventMissingData(missingVms, missingVms2d);
      }
    }
  }

  @Interval(6000) // 6초
  // 누락 체적 vms 스케줄러
  async missingAWBVolumeHandlingLogic() {
    if (this.configService.get<string>('VMS_VOLUME') !== 'true') {
      return;
    }
    console.log('누락 체적 vms 체크 스케줄러 동작함');
    // width 화물이 없다는 것 = 체적이 없다는 것
    const missingAwbs = await this.awbService.getAwbNotVolumeAwb();

    for (const missingAwb of missingAwbs) {
      await this.awbService.createAwbByPlcMqttUsingAsrsAndSkidPlatform(
        missingAwb.barcode,
        missingAwb.separateNumber,
      );
    }
  }

  // @Interval(10000) // 6초
  // Amr에서 누락 vms 스케줄러
  // async missingAWBInAmr() {
  // if (this.configService.get<string>('VMS_VOLUME') !== 'true') {
  //   return;
  // }
  // console.log('Amr에서 누락 vms 스케줄러 동작함');
  // // width 화물이 없다는 것 = 체적이 없다는 것
  // const missingAwbs = await this.amrService.getAwbInAmr();
  //
  // for (const missingAwb of missingAwbs) {
  //   await this.awbService.createAwbByPlcMqttUsingAsrsAndSkidPlatform(
  //     missingAwb.barcode,
  //     missingAwb.separateNumber,
  //   );
  // }
  // }
}
