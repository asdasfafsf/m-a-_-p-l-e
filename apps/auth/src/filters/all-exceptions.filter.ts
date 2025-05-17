import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ERROR_CODE_MAP } from '../common/errors/constants/error.constant';
import { MapleHttpException } from '../common/errors/MapleHttpException';
import { ErrorCode } from '../common/errors/types/error.type';
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
      let code: ErrorCode = ERROR_CODE_MAP.ERROR;
      if (exception instanceof BadRequestException) {
        code = ERROR_CODE_MAP.INVALID_REQUEST;
      }

      if (typeof message === 'string') {
        response.status(status).json({
          code,
          message,
        } as MapleError);

        return;
      }

      if (Array.isArray(message)) {
        response.status(status).json({
          code,
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
