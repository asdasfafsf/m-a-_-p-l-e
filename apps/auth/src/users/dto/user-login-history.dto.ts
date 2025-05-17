import { LoginFailReason } from '../../common/errors/types/login-fail.type';

export class UserLoginHistoryDto {
  userUuid?: string;
  ipv4?: string;
  ipv6?: string;
  success: boolean;
  failReason?: LoginFailReason;
  metadata?: Record<string, any>;
}
