import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AmrService } from '../amr/amr.service';
import { LoggerService } from '../lib/logger/logger.service';
import { AwbService } from '../awb/awb.service';
import path from 'path';
import console from 'console';
import { FileService } from '../file/file.service';

@Injectable()
export class WorkerService {
  constructor(
    private readonly amrService: AmrService,
    private readonly loggerService: LoggerService,
    private readonly awbService: AwbService,
    private readonly fileService: FileService,
  ) {}
  @Cron('*/10 * * * * *', {
    name: 'amrCronJobTest',
    timeZone: 'Asia/Seoul',
  })
  InitialScheduler() {
    //주석 해제 하면 mssql에서 amr 정보 가져오는 스케줄러 동작
    // this.amrService.createAmrByMssql();
  }
  // awb의 누락된 모델링 파일을 다시 조립하기 위한 스케줄링
  // * 10 * * * *
  @Cron('* * 10 * * *', {
    name: 'missingAWBModelingFileHandlingLogic',
    timeZone: 'Asia/Seoul',
  })
  async missingAWBModelingFileHandlingLogic() {
    const missModelAwbList = await this.awbService.getAwbNotCombineModelPath();
    if (missModelAwbList && missModelAwbList.length > 0) {
      for (const awb of missModelAwbList) {
        const name = awb.name;
        const user = 'wmh';
        const documentsFolder = 'Documents';
        const filename = `${name}.png`;
        // const directory = path.join('C:', 'Users', user, documentsFolder);
        const directory = path.join('G:', '내 드라이브');

        const filePath = path.join(directory, filename);

        // nas 서버에 있는 폴더의 경로, 현재는 테스트용도로 서버 로컬 컴퓨터에 지정
        const fileContent = await this.fileService.readFile(filePath);
        if (!fileContent) {
          continue;
        }
        const fileResult = await this.fileService.uploadFileToLocalServer(
          fileContent,
          `${name}.png`,
        );

        // upload된 파일의 경로를 awb정보에 update
        await this.awbService.modelingCompleteToHandlingPath(
          name,
          awb.id,
          fileResult,
        );
      }
    }
    console.log('Performing the action...');
  }
}
