import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  console.log(`listening on port ${port}`);

  // swagger 생성
  const config = new DocumentBuilder()
    .setTitle('현대물류')
    .setDescription('현대물류 api 문서')
    .setVersion('1.0.0')
    // .addTag('minho')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // (경로, 프로그램 인스턴스, 문서객체)

  // cors 설정
  app.enableCors();
  await app.listen(port);

  // 핫 리로딩 적용
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
