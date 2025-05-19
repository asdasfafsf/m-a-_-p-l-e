import {
  ERROR_CODE_MAP,
  ERROR_MESSAGE_MAP,
} from '../../common/errors/constants/error.constant';
import { MapleHttpException } from '../../common/errors/MapleHttpException';

export class TokenExpiredExcetion extends MapleHttpException {
  constructor() {
    super(
      {
        code: ERROR_CODE_MAP.TOKEN_EXPIRED,
        message: ERROR_MESSAGE_MAP[ERROR_CODE_MAP.TOKEN_EXPIRED],
      },
      401,
    );
  }
}
