import { Injectable } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { AmrService } from '../amr/amr.service';
import { LoggerService } from '../lib/logger/logger.service';
import { AwbService } from '../awb/awb.service';
import path from 'path';
import console from 'console';
import { FileService } from '../file/file.service';
import { Awb } from '../awb/entities/awb.entity';
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

  @Interval(300)
  // 0.3 초마다 mssql 에서 amr 데이터를 가져옴
  InitialScheduler() {
    //주석 해제 하면 mssql에서 amr 정보 가져오는 스케줄러 동작
    if (this.configService.get<string>('SCHEDULE') !== 'true') {
      return;
    }
    this.amrService.createAmrByMssql();
    console.log('amr 데이터 수집 스케줄러 동작');
  }

  // awb의 누락된 모델링 파일을 다시 조립하기 위한 스케줄링
  // * 10 * * * *
  // every 10minute between 8am and 7pm
  // @Cron('* */10 8-19 * * *', {
  @Cron('*/10 * * * * *', {
    name: 'missingAWBModelingFileHandlingLogic',
    timeZone: 'Asia/Seoul',
  })
  // 3d 모델 누락 스케줄러
  async missingAWBModelingFileHandlingLogic() {
    if (this.configService.get<string>('LOCAL_SCHEDULE') !== 'true') {
      return;
    }

    const missingAwbs = await this.awbService.getAwbNotCombineModelPath();

    for (const missingAwb of missingAwbs) {
      const missingVms = await this.awbService.getAwbByVmsByName(
        missingAwb.barcode,
      );
      const missingVms2d = await this.awbService.getAwbByVms2dByName(
        missingAwb.barcode,
      );
      if (missingVms || missingVms2d) {
        await this.awbService.preventMissingData(missingVms, missingVms2d);
      }
    }
  }
}
