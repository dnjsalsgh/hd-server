import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ServerResponse } from 'http';

export interface Response<T> {
  data: T;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor<ServerResponse> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const httpResponseObject = context
      .switchToHttp()
      .getResponse<ServerResponse>();
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const { url, method } = httpResponseObject.req;
    const statusCode = httpResponseObject.statusCode;
    const splitUrl = url.split('/')[1];

    let message = '';

    switch (method) {
      case 'GET':
        message = `Search ${splitUrl} successfully`;
        break;
      case 'POST':
        message = `Create ${splitUrl} successfully`;
        break;
      case 'PUT':
      case 'PATCH':
        message = `Update ${splitUrl} successfully`;
        break;
      case 'DELETE':
        message = `Delete ${splitUrl} successfully`;
        break;
    }
    return next.handle().pipe(
      map((data) => {
        // const length = data?.length;
        // data.unshift(length);
        return {
          statusCode: statusCode,
          message: message,
          data: data,
        };
      }),
    );
  }
}
