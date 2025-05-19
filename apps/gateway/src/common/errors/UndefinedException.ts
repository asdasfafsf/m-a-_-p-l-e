import { HttpStatus } from '@nestjs/common';
import { ERROR_CODE_MAP, ERROR_MESSAGE_MAP } from './constants/error.constant';
import { MapleHttpException } from './MapleHttpException';

export class UndefinedException extends MapleHttpException {
  constructor() {
    super(
      { code: ERROR_CODE_MAP.ERROR, message: ERROR_MESSAGE_MAP.ERROR },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
