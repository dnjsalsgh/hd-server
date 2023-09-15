import { Controller, Get, Inject, NotFoundException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Vms } from '../vms/entities/vms.entity';
import mqtt from 'mqtt';
import process from 'process';
import * as dotenv from 'dotenv';
import { MqttService } from '../mqtt.service';
dotenv.config();

@Controller('check')
export class CheckController {
  constructor(
    @Inject('MQTT_SERVICE') private mqttClient: ClientProxy,
    @InjectRepository(Vms, 'mssqlDB')
    private readonly vmsRepository: Repository<Vms>,
    private readonly mqttService: MqttService,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    return 'Server On!';
  }

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

  @Get('mssql')
  async checkMssql() {
    const repositoryExist = this.vmsRepository;
    const exist = await repositoryExist.query(`select 1`);
    return exist ? 'mssql Connected' : 'no Found Mssql';
  }
}
