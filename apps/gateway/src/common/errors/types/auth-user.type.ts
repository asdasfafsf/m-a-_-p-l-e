import { Role } from '../../types/role.type';

export type AuthUserRequest = Express.Request & {
  user: { uuid: string; sub: string; roles: Role[] };
};
