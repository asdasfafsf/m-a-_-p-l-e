import {
  IsNotEmpty,
  IsString,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ROLE_MAP } from '../../common/constants/role.constant';

@ValidatorConstraint({ name: 'isNullOrAdmin', async: false })
export class IsNullOrAdmin implements ValidatorConstraintInterface {
  validate(value: any) {
    return value === undefined || value === null || value === ROLE_MAP.ADMIN;
  }

  defaultMessage() {
    return 'role must be either empty or ADMIN';
  }
}

type AdminRole = (typeof ROLE_MAP)['ADMIN'];

export class UpdateAdminRolesDto {
  @IsString()
  @IsNotEmpty()
  uuid: string;

  @Validate(IsNullOrAdmin)
  role?: AdminRole;
}
