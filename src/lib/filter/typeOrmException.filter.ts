import { Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { QueryFailedError, TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class TypeOrmExceptionFilter extends BaseExceptionFilter {
  catch(exception: QueryFailedError | TypeORMError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    let status = HttpStatus.INTERNAL_SERVER_ERROR; // 기본적으로 내부 서버 오류 상태 코드로 설정
    let errorMessage = '';
    let remark = '';

    if (exception instanceof QueryFailedError) {
      // 필요에 따라 다른 예외 타입을 체크하고 상태 코드를 설정할 수 있습니다.
      status = HttpStatus.BAD_REQUEST; // 예를 들어, 잘못된 요청 상태 코드로 설정
      remark = exception.driverError;
    } else if (exception instanceof TypeORMError) {
      remark = exception.toString();
    }

    errorMessage = 'TypeORM Error: ' + exception.message;
    response
      .status(status)
      .json({ statusCode: status, error: errorMessage, remark: remark });
  }
}
