import { Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { take } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    @Inject('MQTT_SERVICE') private client: ClientProxy,
    private readonly appService: AppService,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    console.log();
    await this.client.send('test', { data: 'test' }).pipe(take(1)).subscribe();

    return this.appService.getHello();
  }
}
