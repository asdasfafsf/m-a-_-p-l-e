import { Role } from '../../common/types/role.type';
import { UserState } from '../types/user.type';

export class InquiryUserDto {
  uuid: string;
  email: string;
  roles: Role[];
  createdAt: Date;
  state: UserState;
}
