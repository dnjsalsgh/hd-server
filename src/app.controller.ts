import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { Observable } from 'rxjs';

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

  @MessagePattern('hyundai/vms1/createFile') //구독하는 주제
  async checkMqtt(@Payload() data) {
    console.log('data = ', data);
  }
}
