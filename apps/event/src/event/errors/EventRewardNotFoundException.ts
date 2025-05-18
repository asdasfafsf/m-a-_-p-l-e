import { HttpStatus } from '@nestjs/common';
import { MapleHttpException } from '../../common/errors/MapleHttpException';

export class EventRewardNotFoundException extends MapleHttpException {
  constructor() {
    super(
      {
        code: 'EVENT_REWARD_NOT_FOUND',
        message: '이벤트를 보상을 찾을 수 없습니다.',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
