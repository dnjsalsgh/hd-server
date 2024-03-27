import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { AmrService } from '../amr/amr.service';
import { LoggerService } from '../lib/logger/logger.service';
import { AwbService } from '../awb/awb.service';
import { FileService } from '../file/file.service';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Hacs } from '../hacs/entities/hacs.entity';
import { Repository } from 'typeorm';
import process from 'process';

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

  // 0.6 초마다 mssql 에서 amr 데이터를 가져옴
  @Interval(600)
  async InitialScheduler() {
    // env파일의 SCHEDULE=True면 스케줄러 실행
    if (this.configService.get<string>('SCHEDULE') !== 'true') {
      return;
    }
    await this.amrService.createAmrByHacs();
  }

  // 3d 모델 누락 스케줄러
  @Interval(6000) // 6초
  async missingAWBModelingFileHandlingLogic() {
    // env파일의 LOCAL_SCHEDULE=True면 스케줄러 실행
    if (this.configService.get<string>('LOCAL_SCHEDULE') !== 'true') {
      return;
    }
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
        await this.awbService.preventMissingData(missingVms, missingVms2d);
      }
    }
  }

  // 누락 체적 vms 스케줄러
  @Interval(6000) // 6초
  async missingAWBVolumeHandlingLogic() {
    if (this.configService.get<string>('VMS_VOLUME') !== 'true') {
      return;
    }
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
