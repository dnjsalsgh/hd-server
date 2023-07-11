import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../lib/logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent');
    const env = this.configService.get('NODE_ENV');
    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      const logMessage =
        env === 'dev'
          ? `${method} ${originalUrl} ${statusCode}`
          : `${method} ${originalUrl} ${statusCode} ${env} ${contentLength} - ${userAgent} ${ip}`;
      this.logger.log(logMessage);
    });

    const loggerService = new LoggerService(
      request.url.slice(1).split('/')[
        request.url.slice(1).split('/').length - 1
      ],
    );
    const tempUrl = request.method + ' ' + request.url.split('?')[0];
    const _headers = request.headers ? request.headers : {};
    const _query = request.query ? request.query : {};
    const _body = request.body ? request.body : {};
    const _url = tempUrl ? tempUrl : {};

    loggerService.info(
      JSON.stringify({
        url: _url,
        headers: _headers,
        query: _query,
        body: _body,
      }),
    );

    next();
  }
}
