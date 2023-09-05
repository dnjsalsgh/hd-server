import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
// implements OnModuleInit
export class AppController {
  constructor(@Inject('MQTT_SERVICE') private mqttClient: ClientProxy) {}

  // onModuleInit() {
  //   this.connectToMqttBroker();
  // }
  //
  // private connectToMqttBroker() {
  //   return this.mqttClient.connect();
  // }

  @Get()
  async getHello(): Promise<string> {
    return 'Hello from NestJS!';
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
