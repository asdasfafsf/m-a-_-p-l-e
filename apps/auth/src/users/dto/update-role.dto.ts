import { IsIn, IsUUID } from 'class-validator';
import { ROLE_MAP } from '../../common/constants/role.constant';
import { Role } from '../../common/types/role.type';

export class UpdateRoleDto {
  @IsIn(Object.values(ROLE_MAP).filter((role) => role !== ROLE_MAP.ADMIN), {
    each: true,
  })
  roles: Role[];

  @IsUUID()
  uuid: string;
}
