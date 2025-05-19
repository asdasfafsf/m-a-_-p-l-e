import { HttpStatus } from '@nestjs/common';
import { MapleHttpException } from '../../common/errors/MapleHttpException';

export class EventNotPendingException extends MapleHttpException {
  constructor() {
    super(
      {
        code: 'EVENT_NOT_PENDING',
        message: '시작되지 않거나 종료되지 않은 이벤트에만 수정이 가능합니다.',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
