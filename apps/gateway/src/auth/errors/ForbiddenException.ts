import { HttpStatus } from '@nestjs/common';
import {
  ERROR_CODE_MAP,
  ERROR_MESSAGE_MAP,
} from '../../common/errors/constants/error.constant';
import { MapleHttpException } from '../../common/errors/MapleHttpException';

export class ForbiddenException extends MapleHttpException {
  constructor() {
    super(
      {
        code: ERROR_CODE_MAP.FORBIDDEN,
        message: ERROR_MESSAGE_MAP[ERROR_CODE_MAP.FORBIDDEN],
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
