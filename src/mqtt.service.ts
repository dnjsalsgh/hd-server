import { Injectable, Logger } from '@nestjs/common';
import * as mqtt from 'mqtt';

@Injectable()
export class MqttService {
  private mqttClient: mqtt.Client;
  constructor() {
    console.log('mqttService 동작함');
    // MQTT 연결 설정
    this.mqttClient = mqtt.connect(
      `mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`,
    );
  }

  getHello() {
    return this.mqttClient;
  }
}
