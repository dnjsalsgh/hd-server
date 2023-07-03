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

// [express style]

// import {
//   Injectable,
//   NestInterceptor,
//   ExecutionContext,
//   CallHandler,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import {
//   BulkInsertedOrUpdatedResult,
//   DeletedResult,
//   DownloadResult,
//   FreeStyleResult,
//   InsertedResult,
//   LoggedInResult,
//   responseCode,
//   ResponseJson,
//   responseType,
//   SelectedAllResult,
//   SelectedInfoResult,
//   SelectedListResult,
//   UpdatedResult,
//   UploadResult,
// } from '../resUtil';
// import { IncomingMessage, ServerResponse } from 'http';
// @Injectable()
// export class ResponseInterceptor<T>
//   implements NestInterceptor<T, ResponseJson<T>>
// {
//   intercept(
//     context: ExecutionContext,
//     next: CallHandler,
//     // ): Observable<ResponseJson<T>> {
//   ): Observable<any> | Promise<Observable<any>> {
//     const type = context.getArgs()[2]?.type; // Assuming 'type' is passed as an argument in the request handler
//     const httpResponseObject = context
//       .switchToHttp()
//       .getResponse<ServerResponse>();
//
//     return next.handle().pipe(
//       map((result) => {
//         const resJson = { ...responseCode.SUCCESS };
//         console.log('httpResponseObject = ', httpResponseObject);
//         if (type === responseType.REG) {
//           const resultData = result as InsertedResult;
//           resJson.message = 'Inserted data successfully';
//           resJson.data = resultData;
//         } else if (type === responseType.BULKREGUPDATE) {
//           const resultData = result as BulkInsertedOrUpdatedResult;
//           resJson.message = 'Inserted data list successfully';
//           resJson.data = resultData;
//         } else if (type === responseType.LIST) {
//           const resultData = result as SelectedListResult<unknown>;
//           resJson.message = 'Searched list successfully';
//           resJson.data = resultData;
//         } else if (type === responseType.LISTALL) {
//           const resultData = result as SelectedAllResult<unknown>;
//           resJson.message = 'Listed data successfully';
//           resJson.data = resultData;
//         } else if (type === responseType.INFO) {
//           const resultData = result as SelectedInfoResult;
//           resJson.message = 'Selected data successfully';
//           resJson.data = resultData;
//         } else if (type === responseType.EDIT) {
//           const resultData = result as UpdatedResult;
//           resJson.message = 'Updated data successfully';
//           resJson.data = resultData;
//         } else if (type === responseType.DELETE) {
//           const resultData = result as DeletedResult;
//           resJson.message = 'Deleted data successfully';
//           resJson.data = resultData;
//         } else if (type === responseType.LOGIN) {
//           const resultData = result as LoggedInResult;
//           resJson.message = 'Logged in successfully';
//           resJson.data = resultData;
//         } else if (type === responseType.FREESTYLE) {
//           const resultData = result as FreeStyleResult;
//           resJson.message = 'Request is successfully done';
//           resJson.data = resultData;
//         } else if (type === responseType.UPLOAD) {
//           const resultData = result as UploadResult;
//           resJson.message = 'Uploaded File successfully';
//           resJson.data = resultData;
//         } else if (type === responseType.DOWNLOAD) {
//           const resultData = result as DownloadResult;
//           resJson.message = 'Downloaded File successfully';
//           resJson.data = resultData;
//         } else {
//           return responseCode.DEFAULT;
//         }
//         console.log('resJson = ', resJson);
//         return resJson;
//       }),
//     );
//   }
// }
