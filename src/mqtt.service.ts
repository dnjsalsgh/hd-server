import { Injectable } from '@nestjs/common';

@Injectable()
export class MqttService {
  getHello(): string {
    return 'Hello World!';
  }
}
