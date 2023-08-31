// core
import { Inject, Injectable, LoggerService as LS } from '@nestjs/common';

// lib
import winston, { transports } from 'winston';
import dayjs from 'dayjs';
import { utilities } from 'nest-winston';

const { errors, combine, timestamp, printf, prettyPrint } = winston.format;

@Injectable()
export class LoggerService implements LS {
  private logger: winston.Logger;

  // constructor(service: string) {
  constructor(@Inject('SERVICE_NAME') private readonly serviceName: string) {
    this.logger = winston.createLogger({
      format: combine(timestamp(), prettyPrint()),
      transports: [
        new transports.File({
          level: 'error',
          filename: `error-${dayjs().format('YYYY-MM-DD')}.log`,
          dirname: 'logs',
          maxsize: 5000000,
          format: combine(
            errors({ stack: true }),
            timestamp({ format: 'isoDateTime' }),
            printf((info) => {
              return `${info.message}`;
            }),
          ),
        }),

        new transports.Console({
          level: 'debug',
          format: combine(
            timestamp({ format: 'isoDateTime' }),
            utilities.format.nestLike(serviceName, {
              prettyPrint: true,
            }),
          ),
        }),

        new transports.File({
          filename: `application-${dayjs().format('YYYY-MM-DD')}.log`,
          dirname: 'logs',
          maxsize: 5000000,
          format: combine(
            timestamp({ format: 'isoDateTime' }),
            // printf((info) => {
            //   return `${dayjs().format("YYYY-MM-DD-HH-HH")}${info.message}`;
            // })
            prettyPrint(),
          ),
        }),
      ],
    });
  }

  log(message: any) {
    // this.logger.log({ level: 'info', message });
    this.logger.log({ level: 'info', message });
  }

  info(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace: string) {
    this.logger.error(message, trace);
  }

  warn(message: string) {
    this.logger.warning(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}
