import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { MapleHttpException } from '../common/errors/MapleHttpException';
import { MapleError } from '../common/errors/types/maple-error.type';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof MapleHttpException) {
      const { code, message } = exception.getResponse() as MapleError;

      response.status(status).json({
        code,
        message,
      });

      return;
    }

    if (exception instanceof HttpException) {
      const message = (exception.getResponse() as any).message;

      if (typeof message === 'string') {
        response.status(status).json({
          code: 'ERROR',
          message,
        } as MapleError);

        return;
      }

      if (Array.isArray(message)) {
        response.status(status).json({
          code: 'ERROR',
          message: message[0],
        } as MapleError);

        return;
      }
    }

    response.status(status).json({
      code: 'ERROR',
      message: '정의되지 않은 오류입니다.',
    });
  }
}
