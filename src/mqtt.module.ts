import { Module } from '@nestjs/common';
import { MqttController } from './mqtt.controller';
import { MqttService } from './mqtt.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import { OutboundResponseSerializer } from './lib/filter/OutboundResposeSerializer';
dotenv.config();

console.log(`mqttmddule에서의 콘솔${process.env.MQTT_HOST}`);
const clients = ClientsModule.register([
  {
    name: 'MQTT_SERVICE', //* MY_MQTT_SERVICE : 의존성 이름
    transport: Transport.MQTT,
    options: {
      host: process.env.MQTT_HOST,
      port: +process.env.MQTT_PORT,
      serializer: new OutboundResponseSerializer(),
    },
  },
]);

@Module({
  imports: [clients],
  controllers: [MqttController],
  providers: [MqttService],
  exports: [clients], // 다른 모듈에서 쓸 수 있게 출력
})
export class MqttModule {
  constructor() {}
}
