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
    if (this.configService.get<string>('SCHEDULE') === 'true') {
      this.amrService.createAmrByMssql();
      console.log('amr 데이터 수집 스케줄러 동작');
    }
  }

  // 폴더와 db와 차이가 나는 파일이름 찾기
  findDuplicates(array1: string[], array2: string[]) {
    return array1.filter((item) => array2.includes(item));
  }

  // awb의 누락된 모델링 파일을 다시 조립하기 위한 스케줄링
  // * 10 * * * *
  @Cron('* 10 * * * *', {
    name: 'missingAWBModelingFileHandlingLogic',
    timeZone: 'Asia/Seoul',
  })
  async missingAWBModelingFileHandlingLogic() {
    const missModelAwbList = await this.awbService.getAwbNotCombineModelPath();
    if (missModelAwbList && missModelAwbList.length > 0) {
      const directory =
        this.configService.get<string>('NODE_ENV') === 'pro'
          ? '/var/nas'
          : this.configService.getOrThrow('NAS_PATH'); // 목표 디랙토리(nas)

      // 폴더 안에 파일 모두 가져오기
      const currentFolder = await this.fileService.readFolder(directory);

      const awbNamesInFolder = currentFolder.map((v) => v.split('.')[0]); // 파일 안에 awb 이름들
      const awbNamesInDB = missModelAwbList.map((v) => v.name); // db 안에 awb 이름들
      const targetAwbs = this.findDuplicates(awbNamesInFolder, awbNamesInDB); // 누락된 awb 를 찾습니다.

      for (const awbName of targetAwbs) {
        const missingFiles = currentFolder.filter((file) =>
          file.includes(awbName),
        ); // 누락된 파일 원본이름으로 찾음 ex) test.png, test.obj

        for (const missingFile of missingFiles) {
          const savedFilePath = path.join(directory, missingFile); // 저장된 파일 경로
          const awbName = missingFile.split('.')[0]; // 확장자를 땐 awb 이름

          // nas에서 파일을 읽어오고 서버에 upload
          const fileContent = await this.fileService.readFile(savedFilePath);
          const pathOfUploadedFile =
            await this.fileService.uploadFileToLocalServer(
              fileContent,
              missingFile,
            );

          // upload된 파일의 경로를 awb정보에 update
          await this.awbService.modelingCompleteToHandlingPath(
            missingFile,
            awbName,
            pathOfUploadedFile,
          );
        }
      }
    }
    console.log('누락된 awb 모델링 파일 연결 스케줄러 동작');
  }
}
