import { REWARD_TYPE_MAP } from '../constants/event.reward.constant';

export type EventRewardType =
  (typeof REWARD_TYPE_MAP)[keyof typeof REWARD_TYPE_MAP];
