import { Module } from '@nestjs/common';
import { MqttController } from './mqtt.controller';
import { MqttService } from './mqtt.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

const clients = ClientsModule.register([
  {
    name: 'MQTT_SERVICE', //* MY_MQTT_SERVICE : 의존성 이름
    transport: Transport.MQTT,
    options: {
      host: 'localhost',
      port: 1883,
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
