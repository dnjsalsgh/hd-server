import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

/*
  @Catch(HttpException)은
  http 통신의 예외를 캐치하겠다는 뜻입니다.
  만약 모든 예외를 캐치하고 싶다면

  @Catch()로 적용하시면 됩니다.
*/
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const err = exception.getResponse() as
      | { statusCode: number; message: any }
      | { error: string; statusCode: 400; message: string[] }; // class-validator의 타입

    console.log(status, err.message, exception.message);

    // class-validator가 발생시킨 에러 배열 해체
    if (err.message && typeof err.message !== 'string') {
      err.message = err?.message?.join(',');
    }

    const json = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: err.message ?? exception.message, // class-validator가 발생시킨 에러, 내가 발생시킨 error
    };

    response.status(status).json(json);
  }
}
