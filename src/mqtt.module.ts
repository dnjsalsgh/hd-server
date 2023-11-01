import { Module } from '@nestjs/common';
import { MqttController } from './mqtt.controller';
import { MqttService } from './mqtt.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import { OutboundResponseSerializer } from './lib/filter/outBoundResposeSerializer.filter';
import process from 'process';

dotenv.config();

console.log(`mqtt connect port : ${process.env.MQTT_HOST}`);
const clients = ClientsModule.register([
  {
    name: 'MQTT_SERVICE', //* MY_MQTT_SERVICE : 의존성 이름
    transport: Transport.MQTT,
    options: {
      url: `mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`,
      serializer: new OutboundResponseSerializer(),
      keepalive: 30000,
      reconnectPeriod: 10,
    },
  },
]);

@Module({
  imports: [clients],
  controllers: [MqttController],
  providers: [MqttService],
  exports: [clients, MqttService], // 다른 모듈에서 쓸 수 있게 출력
})
export class MqttModule {
  constructor() {}
}
