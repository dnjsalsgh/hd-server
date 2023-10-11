import { Controller, Get, Inject } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    @Inject('MQTT_SERVICE') private mqttClient: ClientProxy, // @Inject('MATH_SERVICE') private client: ClientProxy,
    @Inject('REDIS_CLIENT') private readonly redis: RedisClientType,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    return 'Hello from NestJS!';
  }
  @Get('/redis')
  async getRedis(): Promise<string> {
    await this.redis.set('test', '11');
    const value = await this.redis.get('test');
    return value;
  }
}
