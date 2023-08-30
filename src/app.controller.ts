import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller()
export class AppController implements OnModuleInit {
  constructor(@Inject('MQTT_SERVICE') private mqttClient: ClientProxy) {}

  onModuleInit() {
    this.connectToMqttBroker();
  }

  private connectToMqttBroker() {
    return this.mqttClient.connect();
  }

  @Get()
  async getHello(): Promise<string> {
    return 'Hello from NestJS!';
  }

  @Get('/check-mqtt')
  async checkMqtt() {
    const checkObject = await this.mqttClient.connect();
    return checkObject;
  }
}
