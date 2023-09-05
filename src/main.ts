import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './lib/filter/httpExceptionFilter';
import { ResponseInterceptor } from './lib/interceptor/response.interceptor';
import { TypeOrmExceptionFilter } from './lib/filter/typeOrmException.filter';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as process from 'process';
import { WorkerModule } from './worker/worker.module';
import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
  // 1. http서버로 사용
  const app = await NestFactory.create(AppModule);
  // 2. mqtt서버로 사용
  console.log(process.env.MQTT_HOST, process.env.MQTT_PORT);
  const mqttApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.MQTT,
      options: {
        url: `mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`,
      },
    },
  );

  // 스케줄러 프로세스 생성
  const sheduler = await NestFactory.create(WorkerModule);

  // 3. redis서버로 사용
  const redisApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.REDIS,
      options: {
        host: `${process.env.REDIS_HOST}`,
        port: +process.env.REDIS_PORT,
      },
    },
  );

  app.useGlobalPipes(new ValidationPipe()); // class validator 처리
  app.useGlobalFilters(new HttpExceptionFilter()); // Http 에러 처리
  app.useGlobalFilters(new TypeOrmExceptionFilter()); // Typeorm 에러 처리
  app.useGlobalInterceptors(new ResponseInterceptor()); // 반환값 객체화 처리

  const port = process.env.PORT || 3000;
  console.log(`main server start port : ${port}`);

  // swagger 생성
  const config = new DocumentBuilder()
    .setTitle('현대물류')
    .setDescription('현대물류 api 문서')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // (경로, 프로그램 인스턴스, 문서객체)

  // cors 설정
  app.enableCors();
  await mqttApp.listen();
  // await redisApp.listen();
  await app.listen(port);
  await sheduler.init(); // 스케줄러 프로세스 적용
}

bootstrap();
