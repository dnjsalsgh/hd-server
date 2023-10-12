import { Controller, Get, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Vms } from '../vms/entities/vms.entity';
import * as dotenv from 'dotenv';
import { MqttService } from '../mqtt.service';
import { ApiOperation } from '@nestjs/swagger';
import { checkPsServer } from '../lib/util/axios.util';

dotenv.config();

@Controller('check')
export class CheckController {
  constructor(
    @Inject('MQTT_SERVICE') private mqttClient: ClientProxy,
    @InjectRepository(Vms, 'mssqlDB')
    private readonly vmsRepository: Repository<Vms>,
    private readonly mqttService: MqttService,
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
    const exist = await repositoryExist.query(`select 1`);
    return exist ? 'mssql Connected' : 'no Found Mssql';
  }

  @ApiOperation({
    summary: '[ps 통신 확인]',
    description: '',
  })
  @Get('ps')
  async checkPs() {
    return checkPsServer();
  }
}
