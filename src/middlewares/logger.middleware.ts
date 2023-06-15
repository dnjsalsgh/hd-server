import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

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

    next();
  }
}
