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

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : '정의되지 않은 오류입니다.';

    const responseBody = {
      code: 'ERROR',
      message,
    } as MapleError;

    response.status(status).json(responseBody);
  }
}
