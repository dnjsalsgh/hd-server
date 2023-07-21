import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './lib/interceptor/response.interceptor';
import { HttpExceptionFilter } from './lib/filter/httpExceptionFilter';
import { TypeOrmExceptionFilter } from './lib/filter/typeOrmException.filter';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

declare const module: any;

async function bootstrap() {
  // 1. http서버로 사용
  const app = await NestFactory.create(AppModule);
  // 2. mqtt서버로 사용
  const mqttApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.MQTT,
      // options: { host: 'localhost', port: 1833, url: 'mqtt://localhost:1883' },
      options: { url: 'mqtt://localhost:1883' },
    },
  );

  // 3. redis서버로 사용
  const redisApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.REDIS,
      options: {
        host: 'localhost',
        port: 6379,
      },
    },
  );

  app.useGlobalPipes(new ValidationPipe()); // class validator 처리
  app.useGlobalFilters(new HttpExceptionFilter()); // Http 에러 처리
  app.useGlobalFilters(new TypeOrmExceptionFilter()); // Typeorm 에러 처리
  app.useGlobalInterceptors(new ResponseInterceptor()); // 반환값 객체화 처리

  const port = process.env.PORT || 3000;
  console.log(`listening on port ${port}`);

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
  await redisApp.listen();
  await app.listen(port);

  // 핫 리로딩 적용
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
