import { USER_STATE_MAP } from '../constants/user.constant';

export type UserState = (typeof USER_STATE_MAP)[keyof typeof USER_STATE_MAP];
