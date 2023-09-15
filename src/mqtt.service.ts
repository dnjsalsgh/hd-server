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

    // // 연결 오류 처리
    // this.mqttClient.on('error', (error) => {
    //   Logger.error(`MQTT 연결 오류: ${error}`);
    // });
  }

  getHello() {
    // this.mqttClient = mqtt.connect(
    //   `mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`,
    // );
    // this.mqttClient.on('error', (error) => {
    //   Logger.error(`MQTT 연결 오류: ${error}`);
    // });
    // return 'Mqtt와 연결되어있습니다.';
    // if (this.mqttClient.connected) {
    //   return 'Mqtt와 연결되어있습니다.';
    // }
    return this.mqttClient;
  }
}
