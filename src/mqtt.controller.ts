import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload, ClientProxy } from '@nestjs/microservices';
import { take } from 'rxjs';

@Controller()
export class MqttController {
  constructor(@Inject('MQTT_SERVICE') private client: ClientProxy) {
    //* MY_MQTT_SERVICE : 의존성 이름
    setInterval(() => {
      //3초뒤에 메시지를 발송하게 하였습니다.
      const data = {
        number: Math.random(),
        text: MqttController.name,
        time: `진행${new Date().getTime()}`,
      };
      // console.log(`현재시간: ${new Date().toISOString()}`);
      this.client.send('Korean', data).pipe(take(100)).subscribe();
    }, 1000);
  }

  @MessagePattern('World') //구독하는 주제1
  모두받기(@Payload() data) {
    console.log(data);
  }

  @MessagePattern('American') //구독하는 주제2
  고유받기(@Payload() data) {
    console.log(data);
  }
}
