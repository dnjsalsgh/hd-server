import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { sendSlackMessage } from '../util/axios.util';

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
    const err = exception.getResponse() as { statusCode: number; message: any };

    if (err.statusCode >= 400 && err.statusCode < 500) {
      // 400번대의 에러 처리
      console.error('Client Error:', err.message);
    } else if (err.statusCode >= 500 && err.statusCode < 600) {
      // 500번대의 에러 처리
      console.error('Server Error:', err.message);
    } else {
      // 그 외 다른 상태 코드에 대한 처리
      console.error('Unknown Error:', err.message);
    }
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

    const slackMessage = {
      fallback: 'Http Error',

      text: exception,
      pretext: 'httpException.filter.ts 에서 나오는 에러입니다.',

      color: 'warning', // 'good', 'warning', 'danger' 또는 16진수 색상 코드 중 하나일 수 있습니다.

      // 메시지의 테이블에 필드가 표시됩니다.
      fields: [
        {
          title: '에러 입니다.', // 제목에 태그가 포함되어 있지 않을 수 있으며 자동으로 이스케이프됩니다,
          value: JSON.stringify(json),
          short: false, // `value`가 다른 값과 나란히 표시될 정도로 짧은지를 나타내는 옵션 플래그
        },
      ],
    };
    sendSlackMessage(slackMessage);
    response.status(status).json(json);
  }
}
