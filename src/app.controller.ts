import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { take } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    @Inject('MQTT_SERVICE') private client: ClientProxy,
    private readonly appService: AppService,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    await this.client
      .send('test', { data: 'test', time: new Date().toISOString() })
      .pipe(take(1))
      .subscribe();

    return this.appService.getHello();
  }
}
