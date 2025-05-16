import {
  ERROR_CODE_MAP,
  ERROR_MESSAGE_MAP,
} from '../../common/errors/constants/error.constant';
import { MapleHttpException } from '../../common/errors/MapleHttpException';

export class MapleInvalidEmailException extends MapleHttpException {
  constructor() {
    super(
      {
        code: ERROR_CODE_MAP.INVALID_CREDENTIAL,
        message: ERROR_MESSAGE_MAP[ERROR_CODE_MAP.INVALID_CREDENTIAL],
      },
      401,
    );
  }
}
