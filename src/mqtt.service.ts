import { Inject, Injectable } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { ClientProxy } from '@nestjs/microservices';
import { Subscription, take } from 'rxjs';

@Injectable()
export class MqttService {
  private mqttClient: mqtt.Client;
  constructor(@Inject('MQTT_SERVICE') private client: ClientProxy) {
    console.log('mqttService 동작함');
    // MQTT 연결 설정
    this.mqttClient = mqtt.connect(
      `mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`,
    );
  }
  public sendMqttMessage(topic: string, message: any): Subscription {
    return this.client.send(topic, message).pipe(take(1)).subscribe();
  }

  getHello() {
    return this.mqttClient;
  }
}
