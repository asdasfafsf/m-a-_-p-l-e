import { HttpStatus } from '@nestjs/common';
import {
  ERROR_CODE_MAP,
  ERROR_MESSAGE_MAP,
} from '../../common/errors/constants/error.constant';
import { MapleHttpException } from '../../common/errors/MapleHttpException';

export class InActiveUserException extends MapleHttpException {
  constructor() {
    super(
      {
        code: ERROR_CODE_MAP.INACTIVE_USER,
        message: ERROR_MESSAGE_MAP.INACTIVE_USER,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
