import { Role } from '../../common/types/role.type';

export class InquiryUserDto {
  uuid: string;
  email: string;
  roles: Role[];
}
