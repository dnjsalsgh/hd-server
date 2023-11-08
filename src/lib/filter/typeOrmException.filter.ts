import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { QueryFailedError, TypeORMError } from 'typeorm';
import { sendSlackMessage } from '../util/axios.util';

/*
  @Catch(TypeORMError)은
  db의 통신 예외를 캐치하겠다는 뜻입니다.
  만약 모든 예외를 캐치하고 싶다면

  @Catch()로 적용하시면 됩니다.
*/
@Catch(TypeORMError)
export class TypeOrmExceptionFilter extends BaseExceptionFilter {
  catch(exception: QueryFailedError | TypeORMError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    let status = HttpStatus.INTERNAL_SERVER_ERROR; // 기본적으로 내부 서버 오류 상태 코드로 설정
    let errorMessage = '';
    let remark = '';
    // console.error(exception);
    if (exception instanceof QueryFailedError) {
      // 필요에 따라 다른 예외 타입을 체크하고 상태 코드를 설정할 수 있습니다.
      status = HttpStatus.BAD_REQUEST; // 예를 들어, 잘못된 요청 상태 코드로 설정
      remark = exception.driverError;
    } else if (exception instanceof TypeORMError) {
      remark = exception.toString();
    }
    errorMessage = 'TypeORM Error: ' + exception.message;

    const slackMessage = {
      fallback: `TypeORM Error${errorMessage}`,
      text: exception,
      pretext: 'typeOrmException.filter.ts 에서 나오는 에러입니다.',
      color: 'warning', // 'good', 'warning', 'danger' 또는 16진수 색상 코드 중 하나일 수 있습니다.
      // 메시지의 테이블에 필드가 표시됩니다.
      fields: [
        {
          title: errorMessage, // 제목에 태그가 포함되어 있지 않을 수 있으며 자동으로 이스케이프됩니다,
          value: remark,
          short: false, // `value`가 다른 값과 나란히 표시될 정도로 짧은지를 나타내는 옵션 플래그
        },
      ],
    };
    sendSlackMessage(slackMessage);

    response
      .status(status)
      .json({ statusCode: status, error: errorMessage, remark: remark });
  }
}
