import { Response } from 'express';

/* 응답 타입 설정 */
// insert 응답 타입
export interface InsertedResult {
  insertedId: number;
}

export interface InsertedListResult {
  insertedIds: Array<number>;
}

// insertUpdateList 응답 타입
export interface ListInsertUpdatedResult {
  insertedIds?: Array<number>;
  updatedCount?: number;
}

// bulk insert 응답 타입
export interface BulkInsertedResult {
  insertedIds: Array<number>;
}

// bulk insert 응답 타입
export interface BulkInsertedOrUpdatedResult {
  insertedOrUpdatedIds: Array<number>;
}

// selectAll 응답 타입
export type SelectedAllResult<T> = T[];

// selectList 응답 타임
export interface SelectedListResult<T> {
  count: number;
  rows: Array<T>;
}

// selectInfo 응답 타입
export interface SelectedInfoResult {
  id: number;
  [key: string]: unknown;
}

// update 응답 타입
export interface UpdatedResult {
  updatedCount: number;
}

// delete 응답 타입
export interface DeletedResult {
  deletedCount: number;
}

// 로그인 처리 응답 타입
export interface LoggedInResult {
  accessToken: string;
}

// 프리스타일 응답 타입
export interface FreeStyleResult {
  result: unknown;
}

// 업로드 응답 타입
export interface UploadResult {
  result: unknown;
}

// 다운로드 응답 타입
export interface DownloadResult {
  result: unknown;
}
// 최종 응답 타입
export type ResponseJson<T> = {
  status: number;
  code: string;
  message: string | null;
  data:
    | InsertedResult
    | BulkInsertedOrUpdatedResult
    | SelectedInfoResult
    | SelectedAllResult<T>
    | SelectedListResult<T>
    | UpdatedResult
    | DeletedResult
    | LoggedInResult
    | FreeStyleResult
    | UploadResult
    | DownloadResult
    | null;
  remark: unknown;
};

/* 응답 코드 설정 */
// 응답 코드 json
export const responseJson: ResponseJson<unknown> = {
  status: 0,
  code: 'CODE',
  message: null,
  data: null,
  remark: null,
};

interface ResponseCode<T> {
  DEFAULT: ResponseJson<T>;
  SUCCESS: ResponseJson<T>;
  PAGE_NOT_FOUND: ResponseJson<T>;
  BAD_REQUEST_NULLORINVALID: ResponseJson<T>;
  BAD_REQUEST_NOTNULL: ResponseJson<T>;
  BAD_REQUEST_INVALID: ResponseJson<T>;
  BAD_REQUEST_NODATA: ResponseJson<T>;
  BAD_REQUEST_FILEXT: ResponseJson<T>;
  BAD_REQUEST_REJECT: ResponseJson<T>;
  UNAUTHORIZED_ACCESSTOKEN: ResponseJson<T>;
  FORBIDDEN: ResponseJson<T>;
  ERROR: ResponseJson<T>;
}

// 상황 별 응답 설정
export const responseCode: ResponseCode<unknown> = {
  DEFAULT: {
    status: 0,
    code: 'DEFAULT',
    message: null,
    data: null,
    remark: null,
  },
  SUCCESS: {
    status: 200,
    code: 'SUCCESS',
    message: null,
    data: null,
    remark: null,
  },
  PAGE_NOT_FOUND: {
    status: 404,
    code: 'PAGE_NOT_FOUND',
    message: 'Page not found',
    data: null,
    remark: null,
  },
  // 요청 정보 중 null or invalid인 경우 체크
  BAD_REQUEST_NULLORINVALID: {
    status: 400,
    code: 'BAD_REQUEST_NULLORINVALID',
    message: 'Null or invalid value (field1)',
    data: null,
    remark: null,
  },
  // 요청 정보 중 not null을 위반한 경우
  BAD_REQUEST_NOTNULL: {
    status: 400,
    code: 'BAD_REQUEST_NOTNULL',
    message: 'Not allowed null (field1)',
    data: null,
    remark: null,
  },
  // 요청 정보가 잘못 입력된 경우
  BAD_REQUEST_INVALID: {
    status: 400,
    code: 'BAD_REQUEST_INVALID',
    message: 'Invalid value (field1)',
    data: null,
    remark: null,
  },
  // 요청한 데이터가 없어서 처리할 수 없는 경우
  BAD_REQUEST_NODATA: {
    status: 400,
    code: 'BAD_REQUEST_NODATA',
    message: 'There is no data (data)',
    data: null,
    remark: null,
  },
  BAD_REQUEST_FILEXT: {
    status: 400,
    code: 'BAD_REQUEST_FILEXT',
    message: 'Invalid file extension',
    data: null,
    remark: null,
  },
  // 해당 API를 실행할 권한은 있지만 (여러 이유로) 거절 하는 경우
  BAD_REQUEST_REJECT: {
    status: 400,
    code: 'BAD_REQUEST_REJECT',
    message: 'The request cannot be executed.',
    data: null,
    remark: null,
  },
  // accessToken 인증 실패(보유한 토큰이 인증되지 않는 경우)
  UNAUTHORIZED_ACCESSTOKEN: {
    status: 401,
    code: 'UNAUTHORIZED_ACCESSTOKEN',
    message: 'Unauthorized accessToken',
    data: null,
    remark: null,
  },
  // 해당 API를 실행할 권한이 없는 경우
  FORBIDDEN: {
    status: 403,
    code: 'FORBIDDEN',
    message: 'Forbidden or No Permission to Access.',
    data: null,
    remark: null,
  },
  ERROR: {
    status: 500,
    code: 'ERROR',
    message: null,
    data: null,
    remark: null,
  },
};

// (프로세스별)응답 타입
export enum responseType {
  REG,
  BULKREGUPDATE,
  LIST,
  LISTALL,
  INFO,
  EDIT,
  DELETE,
  LOGIN,
  FREESTYLE,
  UPLOAD,
  DOWNLOAD,
}

// 성공 응답(responseJson) 생성하기
export function makeResponseTemplate(
  result: unknown,
  type: responseType,
): ResponseJson<unknown> {
  const resJson = { ...responseCode.SUCCESS };

  if (type === responseType.REG) {
    const resultData = result as InsertedResult;
    resJson.message = 'Inserted data successfully';
    resJson.data = resultData;

    return resJson;
  } else if (type === responseType.BULKREGUPDATE) {
    const resultData = result as BulkInsertedOrUpdatedResult;
    resJson.message = 'Inserted data list successfully';
    resJson.data = resultData;

    return resJson;
  } else if (type === responseType.LIST) {
    const resultData = result as SelectedListResult<unknown>;
    resJson.message = 'Searched list successfully';
    resJson.data = resultData;

    return resJson;
  } else if (type === responseType.LISTALL) {
    const resultData = result as SelectedAllResult<unknown>;
    resJson.message = 'Listed data successfully';
    resJson.data = resultData;

    return resJson;
  } else if (type === responseType.INFO) {
    const resultData = result as SelectedInfoResult;
    resJson.message = 'Selected data successfully';
    resJson.data = resultData;

    return resJson;
  } else if (type === responseType.EDIT) {
    const resultData = result as UpdatedResult;
    resJson.message = 'Updated data successfully';
    resJson.data = resultData;

    return resJson;
  } else if (type === responseType.DELETE) {
    const resultData = result as DeletedResult;
    resJson.message = 'Deleted data successfully';
    resJson.data = resultData;

    return resJson;
  } else if (type === responseType.LOGIN) {
    const resultData = result as LoggedInResult;
    resJson.message = 'Logged in successfully';
    resJson.data = resultData;

    return resJson;
  } else if (type === responseType.FREESTYLE) {
    const resultData = result as FreeStyleResult;
    resJson.message = 'Request is successfully done';
    resJson.data = resultData;

    return resJson;
  } else if (type === responseType.UPLOAD) {
    const resultData = result as UploadResult;
    resJson.message = 'Uploaded File successfully';
    resJson.data = resultData;

    return resJson;
  } else if (type === responseType.DOWNLOAD) {
    const resultData = result as DownloadResult;
    resJson.message = 'Downloaded File successfully';
    resJson.data = resultData;

    return resJson;
  }

  // 여기까지 오면 안됨(모든 프로세스에 대한 처리를 위에서 다 해야 함.)
  return responseCode.DEFAULT;
}

// 실패 응답(responseError) 생성하기
export function makeResponseError(err: unknown): ResponseJson<unknown> {
  if (err instanceof Error) {
    // 일반적인 에러 타이인 경우
    const resJson = responseCode.ERROR;
    resJson.message = err.message;
    resJson.remark = err.stack;

    return resJson;
  }

  if (err instanceof ErrorClass) {
    // 커스텀 에러인 경우
    const resJson = err;

    return resJson;
  }

  // 여기까지 오면 안됨
  return responseCode.ERROR;
}

// 커스텀 에러 클래스
export class ErrorClass implements ResponseJson<unknown> {
  public status: ResponseJson<unknown>['status'];
  public code: ResponseJson<unknown>['code'];
  public message: ResponseJson<unknown>['message'];
  public data: ResponseJson<unknown>['data'];
  public remark: ResponseJson<unknown>['remark'];

  constructor(
    responseJson: ResponseJson<unknown>,
    message?: ResponseJson<unknown>['message'],
  ) {
    this.status = responseJson.status;
    this.code = responseJson.code;
    this.message = message ? message : responseJson.message;
    this.data = responseJson.data;
    this.remark = responseJson.remark;
  }
}

export function ApiJsonResponse(type: responseType): MethodDecorator {
  return function (
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    console.log('originalMethod = ', originalMethod);
    descriptor.value = function (...args: any[]) {
      const result = originalMethod.apply(this, args);

      console.log('result = ', result);
      // let resJson: ResponseJson<unknown> = { ...responseCode.SUCCESS };
      let resJson = { ...responseCode.SUCCESS };

      switch (type) {
        case responseType.REG:
          // resJson['status'] = 200;
          // resJson['message'] = 'Inserted data successfully';
          // resJson['data'] = result as InsertedResult;
          // resJson = {
          //   message: 'Inserted data successfully',
          //   data: result as InsertedResult,
          // };
          break;
        // case responseType.BULKREGUPDATE:
        //   resJson = {
        //     message: 'Inserted data list successfully',
        //     data: result as BulkInsertedOrUpdatedResult,
        //   };
        //   break;
        // case responseType.LIST:
        //   resJson = {
        //     message: 'Searched list successfully',
        //     data: result as SelectedListResult<unknown>,
        //   };
        //   break;
        // case responseType.LISTALL:
        //   resJson = {
        //     message: 'Listed data successfully',
        //     data: result as SelectedAllResult<unknown>,
        //   };
        //   break;
        // case responseType.INFO:
        //   resJson = {
        //     message: 'Selected data successfully',
        //     data: result as SelectedInfoResult,
        //   };
        //   break;
        // case responseType.EDIT:
        //   resJson = {
        //     message: 'Updated data successfully',
        //     data: result as UpdatedResult,
        //   };
        //   break;
        // case responseType.DELETE:
        //   resJson = {
        //     message: 'Deleted data successfully',
        //     data: result as DeletedResult,
        //   };
        //   break;
        // case responseType.LOGIN:
        //   resJson = {
        //     message: 'Logged in successfully',
        //     data: result as LoggedInResult,
        //   };
        //   break;
        // case responseType.FREESTYLE:
        //   resJson = {
        //     message: 'Request is successfully done',
        //     data: result as FreeStyleResult,
        //   };
        //   break;
        // case responseType.UPLOAD:
        //   resJson = {
        //     message: 'Uploaded File successfully',
        //     data: result as UploadResult,
        //   };
        //   break;
        // case responseType.DOWNLOAD:
        //   resJson = {
        //     message: 'Downloaded File successfully',
        //     data: result as DownloadResult,
        //   };
        //   break;
        default:
          resJson = responseCode.DEFAULT;
          break;
      }

      const res: Response = args[1]; // 인덱스에 따라서 응답 객체의 위치를 조정해야 할 수 있습니다.
      // return res.status(200).json(resJson);
      return res;
    };

    return descriptor;
  };
}
