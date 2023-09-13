import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { take } from 'rxjs';

@Controller()
// implements OnModuleInit
export class AppController {
  constructor(
    @Inject('MQTT_SERVICE') private mqttClient: ClientProxy, // @Inject('MATH_SERVICE') private client: ClientProxy,
  ) {}

  // onModuleInit() {
  //   this.client.connect();
  // }
  //
  // private connectToMqttBroker() {
  //   return this.mqttClient.connect();
  // }

  // @Get()
  // async getHello(): Promise<string> {
  //   return 'Hello from NestJS!';
  // }
  @Get()
  async getHello() {
    this.mqttClient.send('hyundai/test', 1234).pipe(take(1)).subscribe();
  }

  // @Get('/check/mqtt')
  // async checkMqtt(): Promise<string> {
  //   const mqttResult = await this.mqttClient.connect();
  //   return mqttResult ? 'mqttConnected' : 'not Found mqtt';
  // }
  // @Get('/check/mssql')
  // async checkMssql() {
  //   return this.secondaryDataSource.metadataTableName;
  // }
}
