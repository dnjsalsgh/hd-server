import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload, ClientProxy } from '@nestjs/microservices';
import { take } from 'rxjs';

@Controller()
export class MqttController {
  constructor(@Inject('MQTT_SERVICE') private client: ClientProxy) {
    //* MY_MQTT_SERVICE : 의존성 이름
    setInterval(() => {
      //5초마다 메시지를 발송하게 하였습니다.
      const data = {
        number: Math.random(),
        text: MqttController.name,
        time: `진행${new Date().getTime()}`,
      };
      this.client.send('Start', data).pipe(take(1)).subscribe();
    }, 5000);
  }

  @MessagePattern('World') //구독하는 주제1
  getAll(@Payload() data) {
    console.log(data);
  }

  @MessagePattern('American') //구독하는 주제2
  getUnique(@Payload() data) {
    console.log(data);
  }
}
