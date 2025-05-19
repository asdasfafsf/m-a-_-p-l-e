import { HttpStatus } from '@nestjs/common';
import { MapleHttpException } from '../../common/errors/MapleHttpException';

export class EventNotFoundException extends MapleHttpException {
  constructor() {
    super(
      {
        code: 'EVENT_NOT_FOUND',
        message: '이벤트를 찾을 수 없습니다.',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
