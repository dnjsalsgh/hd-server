import {
  Body,
  Controller,
  Delete,
  Get,
  OnModuleInit,
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
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateAwbBreakDownDto } from './dto/create-awb-break-down.dto';
import { FileService } from '../file/file.service';
import path from 'path';
import console from 'console';
import { ConfigService } from '@nestjs/config';

@Controller('awb')
@ApiTags('[화물,vms]Awb')
export class AwbController implements OnModuleInit {
  constructor(
    private readonly awbService: AwbService,
    private readonly fileService: FileService,
    private readonly configService: ConfigService,
  ) {}

  private dTimer = +this.configService.getOrThrow('TIMER');
  private timer: NodeJS.Timeout | null = null;

  @ApiOperation({ summary: 'vms 입력데이터 저장하기(scc와 함께)' })
  @Post()
  create(@Body() createAwbDto: CreateAwbDto) {
    return this.awbService.create(createAwbDto);
  }

  @ApiOperation({
    summary: '해포 실행',
    description:
      '부모 화물의 이름을 parameter로 넣고, body에 자식 awb를 배열형태로 입력합니다.',
  })
  @ApiBody({ type: [CreateAwbDto] })
  @Post('/break-down/:parent')
  breakDownByName(
    @Param('parent') parent: string,
    @Body() createAwbDtoArray: CreateAwbDto[],
  ) {
    return this.awbService.breakDown(parent, createAwbDtoArray);
  }

  @ApiOperation({
    summary: '해포 실행 by id',
    description: '부모 화물의 id를 넣고, 자식을 body의 [id]로 넣습니다.',
  })
  @Post('/break-down-by-id/:awbId')
  breakDownById(
    @Param('awbId', ParseIntPipe) awbId: number,
    @Body() body: CreateAwbBreakDownDto,
  ) {
    return this.awbService.breakDownById(awbId, body);
  }

  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'prefab', required: false, type: 'string' })
  @ApiQuery({ name: 'waterVolume', required: false, type: 'number' })
  @ApiQuery({ name: 'squareVolume', required: false, type: 'number' })
  @ApiQuery({ name: 'width', required: false, type: 'number' })
  @ApiQuery({ name: 'length', required: false, type: 'number' })
  @ApiQuery({ name: 'depth', required: false, type: 'number' })
  @ApiQuery({ name: 'weight', required: false, type: 'number' })
  @ApiQuery({ name: 'isStructure', required: false, type: 'boolean' })
  @ApiQuery({ name: 'barcode', required: false, type: 'string' })
  @ApiQuery({ name: 'destination', required: false, type: 'string' })
  @ApiQuery({ name: 'source', required: false, type: 'string' })
  @ApiQuery({ name: 'breakDown', required: false, type: 'boolean' })
  @ApiQuery({ name: 'piece', required: false, type: 'number' })
  @ApiQuery({ name: 'state', required: false, type: 'string' })
  @ApiQuery({ name: 'parent', required: false, type: 'number' })
  @ApiQuery({ name: 'modelPath', required: false, type: 'string' })
  @ApiQuery({ name: 'simulation', required: false, type: 'boolean' })
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
  @Get()
  findAll(@Query() query: Awb & BasicQueryParamDto) {
    return this.awbService.findAll(query);
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

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAwbDto: UpdateAwbDto) {
    return this.awbService.update(+id, updateAwbDto);
  }

  @ApiOperation({
    summary: '모델링 완료 신호를 받으면 awb에 model파일 경로 결합해주기',
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
      'uld 작업(inuld): uld 이력에 들어가 있는 상태입니다.',
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

  @ApiOperation({ summary: '파일 업로드 하기' })
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
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }

  // VMS 설비데이터 데이터를 추적하는 mqtt
  @MessagePattern('hyundai/vms1/eqData') //구독하는 주제
  async createByPlcMatt(@Payload() data) {
    // TODO: edge에서 데이터 형식이 정해지면 로직 변경
    // 만약 누락된 데이터를 등록하기 위한 과정
    if (data && data.count) {
      await this.awbService.preventMissingData(data.count);
    }
    // return this.awbService.create(data);
  }

  // 3D 모델링파일 생성 완료 트리거
  @MessagePattern('hyundai/vms1/createFile') //구독하는 주제
  async updateFileByMqttSignal(@Payload() data) {
    // nas 서버 접속해서 이미지 파일을 다운 받고 upload 진행하기
    if (data.name) {
      const name = data.name as string;
      const user = 'wmh';
      const documentsFolder = 'Documents';
      const filename = `${name}.png`;
      const directory = path.join('C:', 'Users', user, documentsFolder);
      const filePath = path.join(directory, filename);

      // vms데이터를 받았다는 신호를전송합니다
      await this.awbService.modelingCompleteWithNAS(name);

      // nas 서버에 있는 폴더의 경로, 현재는 테스트용도로 서버 로컬 컴퓨터에 지정
      const fileContent = await this.fileService.readFile(filePath);

      const fileResult = await this.fileService.uploadFileToLocalServer(
        fileContent,
        `${name}.png`,
      );

      // upload된 파일의 경로를 awb정보에 update
      await this.awbService.modelingCompleteToHandlingPath(name, fileResult);

      if (this.dTimer === 0) {
        this.performAction();
      } else {
        this.resetTimer();
      }
      console.log('File uploaded to:', fileResult);
    }
  }

  onModuleInit() {
    this.startTimer(); // 서버가 시작될 때 타이머를 시작하거나 초기화합니다.
  }

  private startTimer() {
    if (!this.timer) {
      this.timer = setInterval(() => {
        this.dTimer -= 1;
      }, 1000);
    }
  }

  private resetTimer() {
    this.dTimer = +this.configService.getOrThrow('TIMER');
  }

  /**
   * 모델이 생성되었다는 신호가 10분동안 안왔을 때 model을 db와 연결시키기 위한 메서드
   * db에 저장된 awb들 중 model_path가 없는 것들을 모두 선택
   * nas서버에 awb name으로 파일을 찾는다.
   * @private
   */
  private async performAction() {
    const missModelAwbList = await this.awbService.getAwbNotCombineModelPath();
    if (missModelAwbList && missModelAwbList.length > 0) {
      for (const awb of missModelAwbList) {
        const name = awb.name;
        const user = 'wmh';
        const documentsFolder = 'Documents';
        const filename = `${name}.png`;
        const directory = path.join('C:', 'Users', user, documentsFolder);
        const filePath = path.join(directory, filename);

        // vms데이터를 받았다는 신호를전송합니다
        await this.awbService.modelingCompleteWithNAS(name);

        // nas 서버에 있는 폴더의 경로, 현재는 테스트용도로 서버 로컬 컴퓨터에 지정
        const fileContent = await this.fileService.readFile(filePath);

        const fileResult = await this.fileService.uploadFileToLocalServer(
          fileContent,
          `${name}.png`,
        );

        // upload된 파일의 경로를 awb정보에 update
        await this.awbService.modelingCompleteToHandlingPath(name, fileResult);
      }
    }
    console.log('Performing the action...');
    this.resetTimer();
  }

  @Get('/test/prevent')
  private async preventMissingData() {
    // mssql과 postgres의 vms 정보 개수가 같다면

    return await this.awbService.preventMissingData(206);
  }
}
