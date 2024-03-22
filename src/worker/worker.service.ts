import { Injectable, UseInterceptors } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { AmrService } from '../amr/amr.service';
import { LoggerService } from '../lib/logger/logger.service';
import { AwbService } from '../awb/awb.service';
import console from 'console';
import { FileService } from '../file/file.service';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Hacs } from '../hacs/entities/hacs.entity';
import { Repository } from 'typeorm';
import process from 'process';
import { TransactionInterceptor } from '../lib/interceptor/transaction.interfacepter';
import { winstonLogger } from '../lib/logger/winston.util';

@Injectable()
export class WorkerService {
  constructor(
    private readonly amrService: AmrService,
    private readonly loggerService: LoggerService,
    private readonly awbService: AwbService,
    private readonly fileService: FileService,
    private readonly configService: ConfigService,
    @InjectRepository(Hacs, 'amrDB') // amr에서 화물 정보를 긁어오기 위함
    private readonly hacsRepository: Repository<Hacs>,
  ) {}

  @Interval(600)
  // 0.6 초마다 mssql 에서 amr 데이터를 가져옴
  async InitialScheduler() {
    //주석 해제 하면 mssql에서 amr 정보 가져오는 스케줄러 동작
    if (this.configService.get<string>('SCHEDULE') !== 'true') {
      return;
    }
    await this.amrService.createAmrByHacs();
    // console.log('amr 데이터 수집 스케줄러 동작');
  }

  @Interval(10000)
  // 10 초마다 mssql 에서 amr 알람 데이터
  async amrAlarmCheck() {
    //주석 해제 하면 mssql에서 amr 정보 가져오는 스케줄러 동작
    if (this.configService.get<string>('SCHEDULE') !== 'true') {
      return;
    }
    // console.log('amr 알람 로직 동작');
    // await this.amrService.makeAmrAlarm();
    // console.log('amr 데이터 수집 스케줄러 동작');
  }

  // awb의 누락된 모델링 파일을 다시 조립하기 위한 스케줄링
  @Interval(6000) // 6초
  // 3d 모델 누락 스케줄러
  async missingAWBModelingFileHandlingLogic() {
    if (this.configService.get<string>('LOCAL_SCHEDULE') !== 'true') {
      return;
    }
    // console.log('누락 3d파일 체크 스케줄러 동작함');
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
        if (process.env.LATENCY === 'true') {
          winstonLogger.debug(
            `모델업로드${new Date().toISOString()}/${new Date().getTime()}`,
          );
        }
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
    // console.log('누락 체적 vms 체크 스케줄러 동작함');
    // width 화물이 없다는 것 = 체적이 없다는 것
    const missingAwbs = await this.awbService.getAwbNotVolumeAwb();

    for (const missingAwb of missingAwbs) {
      await this.awbService.createAwbByPlcMqttUsingAsrsAndSkidPlatform(
        missingAwb.barcode,
        missingAwb.separateNumber,
      );
    }
  }
}
