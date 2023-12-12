import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Vms3D } from '../vms/entities/vms.entity';
import { MqttService } from '../mqtt.service';
import { ApiOperation } from '@nestjs/swagger';
import { checkPsServer } from '../lib/util/axios.util';
import { HttpExceptionFilter } from '../lib/filter/httpException.filter';
import { VmsAwbResult } from '../vms-awb-result/entities/vms-awb-result.entity';
import { Hacs } from '../hacs/entities/hacs.entity';
import { FileService } from '../file/file.service';
import { NasPathDto } from './dto/nas-path.dto';

@Controller('check')
export class CheckController {
  constructor(
    @Inject('MQTT_SERVICE') private mqttClient: ClientProxy,
    @InjectRepository(Vms3D, 'mssqlDB')
    private readonly vmsRepository: Repository<Vms3D>,
    @InjectRepository(VmsAwbResult, 'dimoaDB')
    private readonly vmsAwbResultRepository: Repository<Vms3D>,
    @InjectRepository(Hacs, 'amrDB')
    private readonly hacsRepository: Repository<Hacs>,
    private readonly mqttService: MqttService,
    private readonly fileService: FileService,
    private readonly dataSource: DataSource,
  ) {}

  @ApiOperation({
    summary: '[서버의 구동여부를 확인하기 위함]',
    description: '',
  })
  @Get()
  async getHello(): Promise<string> {
    return 'Server On!';
  }

  @ApiOperation({
    summary: '[mqtt 통신 확인]',
    description: '',
  })
  @Get('mqtt')
  async checkMqtt() {
    try {
      const existMqtt = await this.mqttService.getHello();
      if (existMqtt.connected) {
        return 'MQTT 연결이 활성화되어 있습니다.';
      } else {
        throw new NotFoundException('MQTT 연결이 비활성화되어 있습니다.');
      }
    } catch (e) {
      throw new NotFoundException('MQTT 연결이 비활성화되어 있습니다.');
    }
  }

  @ApiOperation({
    summary: '[mssql 통신 확인]',
    description: '',
  })
  @Get('mssql')
  async checkMssql() {
    const repositoryExist = this.vmsRepository;
    const exist = await repositoryExist.query(`SELECT top 1 * from VWMS_3D_RESULT_DATA vdrd ;`);
    return exist;
    // return exist ? 'mssql Connected' : 'no Found Mssql';
  }

  @ApiOperation({
    summary: '[dimoa 통신 확인]',
    description: '',
  })
  @Get('dimoa')
  async checkDimoa() {
    const repositoryExist = this.vmsAwbResultRepository;
    const exist = await repositoryExist.query(`SELECT top 1 * from VWMS_AWB_RESULT var`);
    return exist;
    // return exist ? 'dimoaDB Connected' : 'no Found Mssql';
  }

  @ApiOperation({
    summary: '[amr 통신 확인]',
    description: '',
  })
  @Get('amr')
  async checkAmr() {
    const repositoryExist = this.hacsRepository;
    const exist = await repositoryExist.query(`select 1`);
    return exist ? 'amrDB Connected' : 'no Found Mssql';
  }

  @ApiOperation({
    summary: '[ps 통신 확인]',
    description: '',
  })
  @Get('ps')
  async checkPs() {
    return checkPsServer();
  }

  @ApiOperation({
    summary: '[db 통신 확인]',
    description: '',
  })
  @Get('db')
  async checkDb() {
    try {
      const checkDb = await this.dataSource.query(`select 1`);
      return checkDb ? 'postgresDB Connected.' : 'no Found postgresDB';
    } catch (error) {
      throw new HttpExceptionFilter();
    }
  }

  @ApiOperation({
    summary: '[경로 파일 업로드 확인]',
    description: '',
  })
  @Post('nas')
  async checkNasFileUpdate(@Body() nasPathDto: NasPathDto) {
    try {
      const fileContent = await this.fileService.readFile(nasPathDto.path);
      const fileResult = await this.fileService.uploadFileToLocalServer(
        fileContent,
        `${nasPathDto.path.split('\\').pop()}`,
      );
      return fileResult;
    } catch (error) {
      console.error(error);
    }
  }
}
