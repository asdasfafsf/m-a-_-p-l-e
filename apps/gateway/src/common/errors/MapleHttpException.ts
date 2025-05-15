import { HttpException, HttpStatus } from '@nestjs/common';
import { MapleError } from './types/maple-error.type';

export class MapleHttpException extends HttpException {
  constructor({ code, message }: MapleError, statusCode: HttpStatus) {
    super({ code, message }, statusCode);
  }
}
