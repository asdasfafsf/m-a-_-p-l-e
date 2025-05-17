import { LOGIN_FAIL_REASON_MAP } from '../../constants/login-fail.constant';

export type LoginFailReason =
  (typeof LOGIN_FAIL_REASON_MAP)[keyof typeof LOGIN_FAIL_REASON_MAP];
