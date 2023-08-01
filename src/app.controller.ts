import { Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { take } from 'rxjs';
import { RedisCacheService } from './cache/redis.service';

@Controller()
export class AppController {
  constructor(
    @Inject('MQTT_SERVICE') private client: ClientProxy,
    private readonly appService: AppService,
    private cacheManager: RedisCacheService,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    // await this.client
    //   .send('test', { data: 'test', time: new Date().toISOString() })
    //   .pipe(take(1))
    //   .subscribe();

    return this.appService.getHello();
  }
}
