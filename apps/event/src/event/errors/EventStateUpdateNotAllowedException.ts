import { HttpStatus } from '@nestjs/common';
import { MapleHttpException } from '../../common/errors/MapleHttpException';

export class EventStateUpdateNotAllowedException extends MapleHttpException {
  constructor() {
    super(
      {
        code: 'EVENT_STATE_UPDATE_NOT_ALLOWED',
        message: '이벤트 상태를 변경할 수 없습니다.',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
