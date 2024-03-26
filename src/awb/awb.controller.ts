import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionInterceptor } from '../lib/interceptor/transaction.interfacepter';
import { TransactionManager } from '../lib/decorator/transaction.decorator';
import { EntityManager, TypeORMError } from 'typeorm';

import { UpdateAwbDto } from './dto/update-awb.dto';
import { CreateAwbDto } from './dto/create-awb.dto';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { PrepareBreakDownAwbInputDto } from './dto/prepare-break-down-awb-input.dto';
import { InjectionSccDto } from './dto/injection-scc.dto';

import { Awb } from './entities/awb.entity';
import { Vms3D } from '../vms/entities/vms.entity';
import { Vms2d } from '../vms2d/entities/vms2d.entity';
import { VmsAwbResult } from '../vms-awb-result/entities/vms-awb-result.entity';
import { VmsAwbHistory } from '../vms-awb-history/entities/vms-awb-history.entity';
import { FileService } from '../file/file.service';
import { AwbService } from './awb.service';
import { ParseIdListPipe } from '../lib/pipe/parseIdList.pipe';
import { AwbUtilService } from './awbUtil.service';
import console from 'console';
import { AlarmService } from '../alarm/alarm.service';
import process from 'process';
import { winstonLogger } from '../lib/logger/winston.util';

@Controller('awb')
@ApiTags('[화물,vms]Awb')
export class AwbController {
  private messageQueue = [];
  private readonly processInterval = 500; // 처리 간격을 500ms (0.5초)로 설정
  private invmsProcessing = false;

  constructor(
    private readonly awbService: AwbService,
    private readonly awbUtilService: AwbUtilService,
    private readonly fileService: FileService,
    private readonly configService: ConfigService,
    private readonly alarmService: AlarmService,
    @Inject('MQTT_SERVICE') private client: ClientProxy,
  ) {
    // setInterval(() => this.processMessage(), this.processInterval);
  }

  // 0.5초마다 큐에서 메시지를 꺼내 처리
  // private async processMessage() {
  // if (this.messageQueue.length > 0 && !this.processing) {
  //   this.processing = true; // 처리 중 플래그 설정
  //   const message = this.messageQueue.shift();
  //   await this.awbService.createAwbByPlcMqtt(message);
  //   this.processing = false; // 처리 완료 후 플래그 해제
  // }
  // }

  @ApiOperation({ summary: 'vms 입력데이터 저장하기(scc와 함께)' })
  @UseInterceptors(TransactionInterceptor)
  @Post()
  create(
    @Body() createAwbDto: CreateAwbDto,
    @TransactionManager() queryRunnerManager: EntityManager,
  ) {
    return this.awbService.create(createAwbDto, queryRunnerManager);
  }

  @ApiOperation({ summary: '리스트 형태로vms 입력데이터 저장하기(scc와 함께)' })
  @ApiBody({ type: [CreateAwbDto] })
  @UseInterceptors(TransactionInterceptor)
  @Post('/list')
  createList(
    @Body() createAwbDto: CreateAwbDto[],
    @TransactionManager() queryRunnerManager: EntityManager,
  ) {
    return this.awbService.createList(createAwbDto, queryRunnerManager);
  }

  @ApiOperation({
    summary:
      'vms 입력데이터 저장하기, 디모아, nas에 모델링 파일 들어왔다고 가정',
  })
  @Post('/integrate')
  createIntegrate(@Body() createAwbDto: CreateAwbDto) {
    return this.awbService.createIntegrate(createAwbDto);
  }

  @ApiOperation({
    summary: 'ps에 화물 해포 요청',
    description: 'ps에 화물 해포 요청보네기, piece 수만큼 화물이 해포될 예정',
  })
  @UseInterceptors(TransactionInterceptor)
  @Post('/break-down/for-ps')
  breakDownEvent(
    @Body() body: PrepareBreakDownAwbInputDto,
    @TransactionManager() queryRunnerManager: EntityManager,
  ) {
    return this.awbService.breakDownForPs(body, queryRunnerManager);
  }

  @ApiOperation({
    summary: '해포 실행',
    description:
      '부모 화물의 Id을 parameter로 넣고, body에 자식 awb를 배열형태로 입력합니다.',
  })
  @ApiBody({ type: [CreateAwbDto] })
  @UseInterceptors(TransactionInterceptor)
  @Post('/break-down/:parent')
  breakDownByName(
    @Param('parent') parentId: string,
    @Body() createAwbDtoArray: CreateAwbDto[],
    @TransactionManager() queryRunnerManager: EntityManager,
  ) {
    return this.awbService.breakDown(
      +parentId,
      createAwbDtoArray,
      queryRunnerManager,
    );
  }

  @ApiOperation({
    summary: 'scc 주입',
    description: '존재하는 화물에 scc를 주입',
  })
  @UseInterceptors(TransactionInterceptor)
  @Post('/injection/:awbId')
  injectionScc(
    @Param('awbId', ParseIntPipe) awbId: number,
    @Body() body: InjectionSccDto,
    @TransactionManager() queryRunnerManager: EntityManager,
  ) {
    return this.awbService.injectionScc(awbId, body, queryRunnerManager);
  }

  @ApiQuery({ name: 'ghost', required: false, type: 'boolean' })
  @ApiQuery({ name: 'prefab', required: false, type: 'string' })
  @ApiQuery({ name: 'waterVolume', required: false, type: 'number' })
  @ApiQuery({ name: 'squareVolume', required: false, type: 'number' })
  @ApiQuery({ name: 'width', required: false, type: 'number' })
  @ApiQuery({ name: 'length', required: false, type: 'number' })
  @ApiQuery({ name: 'depth', required: false, type: 'number' })
  @ApiQuery({ name: 'weight', required: false, type: 'number' })
  @ApiQuery({ name: 'isStructure', required: false, type: 'boolean' })
  @ApiQuery({ name: 'barcode', required: false, type: 'string' })
  @ApiQuery({ name: 'separateNumber', required: false, type: 'number' })
  @ApiQuery({ name: 'destination', required: false, type: 'string' })
  @ApiQuery({ name: 'source', required: false, type: 'string' })
  @ApiQuery({ name: 'breakDown', required: false, type: 'boolean' })
  @ApiQuery({ name: 'piece', required: false, type: 'number' })
  @ApiQuery({ name: 'state', required: false, type: 'string' })
  @ApiQuery({ name: 'parent', required: false, type: 'number' })
  @ApiQuery({ name: 'modelPath', required: false, type: 'string' })
  @ApiQuery({ name: 'dataCapacity', required: false, type: 'number' })
  @ApiQuery({ name: 'flight', required: false, type: 'string' })
  @ApiQuery({ name: 'from', required: false, type: 'string' })
  @ApiQuery({ name: 'airportArrival', required: false, type: 'string' })
  @ApiQuery({ name: 'path', required: false, type: 'string' })
  @ApiQuery({ name: 'spawnRatio', required: false, type: 'number' })
  @ApiQuery({ name: 'description', required: false, type: 'string' })
  @ApiQuery({ name: 'rmComment', required: false, type: 'string' })
  @ApiQuery({ name: 'localTime', required: false, type: 'Date' })
  @ApiQuery({ name: 'localInTerminal', required: false, type: 'string' })
  @ApiQuery({ name: 'simulation', required: false, type: 'boolean' })
  @ApiQuery({ name: 'createdAtFrom', required: false })
  @ApiQuery({ name: 'createdAtTo', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'AirCraftSchedule', required: false, type: 'number' })
  @Get()
  findAll(@Query() query: Awb & BasicQueryParamDto) {
    return this.awbService.findAll(query);
  }

  @ApiOperation({
    summary: '항공편(AirCraftSchedule) 안에 있는 화물을 csv로 export',
    description: '항공편id를 기준으로 안에 있는 화물을 csv로 export',
  })
  @ApiQuery({ name: 'simulation', required: false, type: 'boolean' })
  @ApiQuery({ name: 'createdAtFrom', required: false })
  @ApiQuery({ name: 'createdAtTo', required: false })
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'AirCraftSchedule', required: false, type: 'number' })
  @Get('/print-csv')
  printCsv(@Query() query: Awb & BasicQueryParamDto) {
    return this.awbService.printCsv(query);
  }

  @ApiOperation({ summary: '해포화물 검색' })
  @Get('/family/:id')
  getFamily(@Param('id') id: string) {
    return this.awbService.findFamily(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.awbService.findOne(+id);
  }

  @ApiOperation({ summary: 'awbId로 scc들 검색' })
  @Get('scc/:awbId')
  getScc(@Param('awbId') awbId: string) {
    return this.awbService.getScc(+awbId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAwbDto: UpdateAwbDto) {
    return this.awbService.update(+id, updateAwbDto);
  }

  @ApiOperation({
    summary:
      '[사용x] 모델링 완료 신호를 받으면 awb에 model파일 경로 결합해주는 태스트 api, 현재는 creatFile 신호 받으면 자동으로 연결',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Put('modeling-complete/:id/')
  @UseInterceptors(FileInterceptor('file'))
  modelingComplete(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.awbService.modelingCompleteById(id, file);
  }

  @ApiOperation({
    summary: '화물의 상태를 변경하기 위함',
    description:
      '예약미입고(saved): vms에 들어가지 않고 화물만 등록되있는 상태 입니다.\n' +
      '\n' +
      '입고중(invms): vms에 들어가 있는 상태입니다.\n' +
      '\n' +
      '창고대기(inasrs): 창고안에 들어있는 상태입니다\n' +
      '\n' +
      '불출예정(register): 자동창고작업지시에 등록되어있는 상태 입니다.\n' +
      '\n' +
      '이동중(outasrs): amr에 출고 신호를 보내고 바뀌어야 할 상태 입니다.\n' +
      '\n' +
      'uld 작업장 대기(inskidplatform): 안착대에 있는 상태입니다.\n' +
      '\n' +
      'uld 작업(inuld): uld 이력에 들어가 있는 상태입니다.\n' +
      '\n' +
      '회수(return): 안착대에 있는걸 회수 합니다.\n' +
      '\n' +
      '반송(recall): 안착대에 있는걸 반송합니다.',
  })
  @Put(':id/:state')
  updateState(
    @Param('id', ParseIntPipe) id: number,
    @Param('state') state: string,
    @Body() updateAwbDto?: UpdateAwbDto,
  ) {
    return this.awbService.updateState(id, state, updateAwbDto);
  }

  @ApiQuery({ name: 'idList', required: false, type: 'string' })
  @Put('change/all-awb/:state')
  updateStateList(
    @Param('state') state: string,
    @Query('idList', ParseIdListPipe) idList?: string,
    @Body() updateAwbDto?: UpdateAwbDto,
  ) {
    return this.awbService.updateStateList(
      idList as unknown as number[],
      state,
      updateAwbDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.awbService.remove(+id);
  }

  // 3초 딜레이를 위한 Promise 기반의 delay 함수
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // VMS 설비데이터 데이터를 추적하는 mqtt
  @MessagePattern('hyundai/vms1/eqData') //구독하는 주제
  async createByPlcMatt(@Payload() data) {
    if (data && this.configService.get<string>('VMS_DATA') !== 'true') {
      return;
    }

    // 1초 딜레이로 부하 줄이기
    // if (!this.invmsProcessing) {
    //   this.invmsProcessing = true; // 처리 시작 표시

      if (process.env.VMSLATENCY === 'true') {
        winstonLogger.debug(
          `vms mqtt 수신 ${new Date().toISOString()}/${new Date().getTime()}`,
        );
      }
      // 메시지 처리 로직
      await this.awbService.createAwbByPlcMqtt(data);

      /**
       * vms에서 오는 알람 처리를 위한 로직
       * awbService에 로직 생성하려고 하면 주입 모듈 꼬여서 안넣어둠
       */
      const VMS_08_01_P2A_Total_Error = data['VMS_08_01_P2A_Total_Error'];

      if (VMS_08_01_P2A_Total_Error === 0) {
        return;
      }

      const previousVMS_08_01_P2A_Total_Error =
        await this.alarmService.getPreviousAlarmState(
          'VMS_08_01_P2A_Total_Error',
          'VMS 계측기 에러',
        );

      if (previousVMS_08_01_P2A_Total_Error && VMS_08_01_P2A_Total_Error) {
        await this.alarmService.changeAlarm(
          previousVMS_08_01_P2A_Total_Error,
          true,
        );
      } else if (
        !previousVMS_08_01_P2A_Total_Error &&
        VMS_08_01_P2A_Total_Error
      ) {
        await this.alarmService.makeAlarm(
          'VMS_08_01_P2A_Total_Error',
          'VMS 계측기 에러',
        );
      }

      // 3초 딜레이
    //   await this.delay(600);

    //   this.invmsProcessing = false; // 처리 완료 표시
    // }

    // this.client.send(`hyundai/vms1/eqData2`, data).pipe(take(1)).subscribe();
  }

  // 3d 모델링 파일 트리거를 받아서 하는것이 아닌 mqtt로 직접 awb 정보를 받는다. 바로 위에 메서드로 대체
  // mssql에서 데이터 가져오기, 3D 모델링파일 생성 완료 트리거
  @MessagePattern('hyundai/vms1/createFile') // 구독하는 주제
  async updateAwbByVmsDB(@Payload() data) {
    if (this.configService.get<string>('LOCAL_SCHEDULE') === 'true') {
      return;
    }
    // console.log('스케줄러 동작함');
    // // 화물 100개 limit 걸기
    // const missingAwbs = await this.awbService.getAwbNotCombineModelPath(10);
    //
    // for (const missingAwb of missingAwbs) {
    //   const missingVms = await this.awbService.getAwbByVmsByName(
    //     missingAwb.barcode,
    //     missingAwb.separateNumber,
    //   );
    //   const missingVms2d = await this.awbService.getAwbByVms2dByName(
    //     missingAwb.barcode,
    //     missingAwb.separateNumber,
    //   );
    //   if (missingVms || missingVms2d) {
    //     // 누락 로직 돌고 있으니 모델링 누락 스케줄러 동작안해도됨
    //     await this.awbService.preventMissingData(missingVms, missingVms2d);
    //   }
    // }

    // try {
    //   // console.time('vmsTimer');
    //   // console.time('findVms');
    //   // vms 체적 데이터 가져오기
    //   const vmsAwbHistoryDataList = await this.fetchVmsAwbHistoryDataLimit100();
    //   if (!vmsAwbHistoryDataList || !(vmsAwbHistoryDataList?.length > 0)) {
    //     throw new NotFoundException(
    //       `vms 테이블에 데이터가 없습니다. in createFile topic}`,
    //     );
    //   }
    //   console.time('in100');
    //   for (const vmsAwbHistoryData of vmsAwbHistoryDataList) {
    //     // bill_No으로 vmsAwbResult 테이블의 값 가져오기 위함(기존에는 최상단의 vms를 가져옴)
    //     const vmsAwbResult = await this.fetchVmsAwbResultDataLimit1(
    //       vmsAwbHistoryData.AWB_NUMBER,
    //     );
    //     // vms 모델 데이터 가져오기
    //     const vms3Ddata = await this.fetchAwbDataByBarcode(vmsAwbHistoryData);
    //     const vms2dData = await this.fetchAwb2dDataByBarcode(vmsAwbHistoryData);
    //
    //     // if (!vms3Ddata || !vms2dData) {
    //     //   throw new NotFoundException('모델링 테이블에 데이터가 없습니다.');
    //     // }
    //     // console.timeEnd('findVms');
    //     // 가져온 데이터를 조합해서 db에 insert 로직 호출하기
    //     await this.createAwbDataInMssql(
    //       vms3Ddata,
    //       vms2dData,
    //       vmsAwbResult,
    //       vmsAwbHistoryData,
    //     );
    //   }
    //   console.timeEnd('in100');
    //   // mqtt 메세지 보내기 로직 호출
    //   // await this.sendModelingCompleteSignal();
    //   // console.timeEnd('vmsTimer');
    //   console.log('vms 동기화 완료');
    // } catch (error) {
    //   console.error('Error:', error);
    // }
  }

  private async fetchAwbData() {
    return await this.awbService.getAwbByVms(1);
  }

  private async fetchAwb2dData() {
    return await this.awbService.getAwbByVms2d(1);
  }

  // vms3D에서 이름으로 찾아오는 메서드
  private async fetchAwbDataByBarcode(vmsAwbHistoryData: VmsAwbHistory) {
    return await this.awbService.getAwbByVmsByName(
      vmsAwbHistoryData.AWB_NUMBER,
      vmsAwbHistoryData.SEPARATION_NO,
    );
  }

  // vms2에서 이름으로 찾아오는 메서드
  private async fetchAwb2dDataByBarcode(vmsAwbHistoryData: VmsAwbHistory) {
    return await this.awbService.getAwbByVms2dByName(
      vmsAwbHistoryData.AWB_NUMBER,
      vmsAwbHistoryData.SEPARATION_NO,
    );
  }

  private async fetchVmsAwbResultData(vms: Vms3D) {
    const AWB_NUMBER = vms.AWB_NUMBER;
    return await this.awbService.getVmsByAwbNumber(AWB_NUMBER);
  }

  private async fetchVmsAwbHistoryData(vms: Vms3D) {
    const AWB_NUMBER = vms.AWB_NUMBER;
    return await this.awbService.getLastAwbByAwbNumber(AWB_NUMBER);
  }

  // 최신 VWMS_AWB_RESULT 테이블에 있는 정보 가져오기
  private async fetchVmsAwbResultDataLimit1(barcode: string) {
    return await this.awbService.getLastVmsAwbResult(barcode);
  }

  // VWMS_AWB_HISTORY 테이블에 있는 정보 100개 가져오기
  private async fetchVmsAwbHistoryDataLimit100() {
    // return await this.awbService.getLastVmsAwbHistory();
    return await this.awbService.get100VmsAwbHistory();
  }

  // VWMS_AWB_HISTORY 테이블에 있는 정보 barcode, separateNumber로 정보 가져오기
  private async fetchVmsAwbHistoryByBarcodeAndSeparateNumber(
    barcode: string,
    separateNumber: number,
  ) {
    return await this.awbService.getVmsAwbHistoryByBarcodeAndSeparateNumber(
      barcode,
      separateNumber,
    );
  }

  private async createAwbDataInMssql(
    vms: Vms3D,
    vms2d: Vms2d,
    vmsAwbResult: VmsAwbResult,
    vmsAwbHistory: VmsAwbHistory,
  ) {
    // vms db에서 값이 들어오지 않았을 때 예외처리
    // if (!vms) this.errorMessageHandling(vms, 'vms');
    // if (!vms2d) this.errorMessageHandling(vms2d, 'vms2d');

    // TODO 개발용으로 vmsAwbResult 테이블 없으니 이렇게 함 주석 해제할 것
    // if (!vmsAwbResult) this.errorMessageHandling(vmsAwbResult, 'vmsAwbResult');
    if (!vmsAwbHistory)
      this.errorMessageHandling(vmsAwbHistory, 'vmsAwbHistory');

    const awb = await this.awbService.createWithMssql(
      vms,
      vms2d,
      vmsAwbResult,
      vmsAwbHistory,
    );
    return awb;
  }

  private errorMessageHandling(target: any, tableName: string) {
    throw new TypeORMError(
      `${tableName} 테이블에 정보가 정확하지 않습니다. ${target}: ${target}`,
    );
  }

  private async sendModelingCompleteSignal() {
    await this.awbService.sendModelingCompleteMqttMessage();
  }
}

// 메시지를 큐에 추가
// this.messageQueue.push(data);

// 메시지 큐의 길이가 10을 초과하면 가장 오래된 메시지부터 제거(메모리 관리 문제)
// while (this.messageQueue.length > 10) {
//   this.messageQueue.shift(); // 배열의 첫 번째 요소를 제거
// }
