import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Vms } from '../vms/entities/vms.entity';

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
    return mqttResult ? 'mqtt Connected' : 'not Found mqtt';
  }

  @Get('mssql')
  async checkMssql() {
    const repositoryExist = this.vmsRepository;
    return repositoryExist ? 'mssql Connected' : 'no Found Mssql';
  }
}
