import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Vms } from '../vms/entities/vms.entity';
import mqtt from 'mqtt';
import process from 'process';
import * as dotenv from 'dotenv';
dotenv.config();

@Controller('check')
export class CheckController {
  constructor(
    @Inject('MQTT_SERVICE') private mqttClient: ClientProxy,
    @InjectRepository(Vms, 'mssqlDB')
    private readonly vmsRepository: Repository<Vms>,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    return 'Hello from NestJS!';
  }

  @Get('mqtt')
  async checkMqtt(): Promise<string> {
    const mqttResult = await this.mqttClient.connect();
    const mqttClient = mqtt.connect(
      `mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`,
    );
    if (mqttClient.connected) {
      return 'MQTT 연결이 활성화되어 있습니다.';
    } else {
      return 'MQTT 연결이 비활성화되어 있습니다.';
    }
  }

  @Get('mssql')
  async checkMssql() {
    const repositoryExist = this.vmsRepository;
    return repositoryExist ? 'mssql Connected' : 'no Found Mssql';
  }
}
