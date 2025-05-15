import { ROLE_MAP } from '../constants/role.constant';

export type Role = (typeof ROLE_MAP)[keyof typeof ROLE_MAP];
