import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AwbService } from './awb.service';
import { CreateAwbDto } from './dto/create-awb.dto';
import { UpdateAwbDto } from './dto/update-awb.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Awb } from './entities/awb.entity';
import { BasicQueryParamDto } from '../lib/dto/basicQueryParam.dto';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateAwbBreakDownDto } from './dto/create-awb-break-down.dto';
import { FileService } from '../file/file.service';
import console from 'console';
import { ConfigService } from '@nestjs/config';
import { take } from 'rxjs';
import { CreateAwbWithAircraftDto } from './dto/create-awb-with-aircraft.dto';
import { TransactionInterceptor } from '../lib/interceptor/transaction.interfacepter';
import { TransactionManager } from '../lib/decorator/transaction.decorator';
import { EntityManager } from 'typeorm';
import { Vms3D } from '../vms/entities/vms.entity';
import { Vms2d } from '../vms2d/entities/vms2d.entity';
import { InjectionSccDto } from './dto/injection-scc.dto';
import { VmsAwbResult } from '../vms-awb-result/entities/vms-awb-result.entity';
import { VmsAwbHistory } from '../vms-awb-history/entities/vms-awb-history.entity';
import { PrepareBreakDownAwbInputDto } from './dto/prepare-break-down-awb-input.dto';

@Controller('awb')
@ApiTags('[화물,vms]Awb')
export class AwbController {
  constructor(
    private readonly awbService: AwbService,
    private readonly fileService: FileService,
    private readonly configService: ConfigService,
    @Inject('MQTT_SERVICE') private client: ClientProxy,
  ) {}

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
    summary:
      '[사용x] vms 입력데이터 저장하기(scc와 항공편 스케줄 함께) /airschedule/awb를 사용하세요',
  })
  @Post('/aircraft')
  createWithAircraftInfo(@Body() createAwbDto: CreateAwbWithAircraftDto) {
    return this.awbService.createWithAircraft(createAwbDto);
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
    summary: '해포 실행 by id',
    description: '부모 화물의 id를 넣고, 자식을 body의 [id]로 넣습니다.',
  })
  @UseInterceptors(TransactionInterceptor)
  @Post('/break-down-by-id/:awbId')
  breakDownById(
    @Param('awbId', ParseIntPipe) awbId: number,
    @Body() body: CreateAwbBreakDownDto,
    @TransactionManager() queryRunnerManager: EntityManager,
  ) {
    return this.awbService.breakDownById(awbId, body, queryRunnerManager);
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.awbService.remove(+id);
  }

  // VMS 설비데이터 데이터를 추적하는 mqtt
  @MessagePattern('hyundai/vms1/eqData') //구독하는 주제
  async createByPlcMatt(@Payload() data) {
    // vms 데이터 mqtt로 publish 하기 위함
    this.client.send(`hyundai/vms1/eqData2`, data).pipe(take(1)).subscribe();
  }

  // mssql에서 데이터 가져오기, 3D 모델링파일 생성 완료 트리거
  @MessagePattern('hyundai/vms1/createFile') // 구독하는 주제
  async updateAwbByVmsDB(@Payload() data) {
    try {
      const vms3Ddata = await this.fetchAwbData();
      const vms2dData = await this.fetchAwb2dData();

      if (!vms3Ddata) {
        throw new NotFoundException('vms 테이블에 데이터가 없습니다.');
      }
      const vmsAwbHistoryData = await this.fetchVmsAwbHistoryData(vms3Ddata);
      const sccData = await this.fetchVmsAwbResultData(vms3Ddata);

      await this.createAwbDataInMssql(
        vms3Ddata,
        vms2dData,
        sccData,
        vmsAwbHistoryData,
      );
      await this.sendModelingCompleteSignal();

      console.log('Modeling complete');
    } catch (error) {
      console.error('Error:', error);
    }
  }

  private async fetchAwbData() {
    return await this.awbService.getAwbByVms(1);
  }

  private async fetchAwb2dData() {
    return await this.awbService.getAwbByVms2d(1);
  }

  private async fetchVmsAwbHistoryData(vms: Vms3D) {
    const AWB_NUMBER = vms.AWB_NUMBER;
    return await this.awbService.getLastAwbByAwbNumber(AWB_NUMBER);
  }

  private async fetchVmsAwbResultData(vms: Vms3D) {
    const AWB_NUMBER = vms.AWB_NUMBER;
    return await this.awbService.getSccByAwbNumber(AWB_NUMBER);
  }

  private async createAwbDataInMssql(
    vms: Vms3D,
    vms2d: Vms2d,
    sccData: VmsAwbResult,
    vmsAwbHistory: VmsAwbHistory,
  ) {
    await this.awbService.createWithMssql(vms, vms2d, sccData, vmsAwbHistory);
  }

  private async sendModelingCompleteSignal() {
    await this.awbService.sendModelingCompleteMqttMessage();
  }
}
