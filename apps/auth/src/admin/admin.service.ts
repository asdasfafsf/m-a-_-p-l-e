import { Injectable } from '@nestjs/common';
import { ROLE_MAP } from '../common/constants/role.constant';
import { UsersService } from '../users/users.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminRolesDto } from './dto/update-admin-role.dto';

@Injectable()
export class AdminService {
  constructor(private readonly usersService: UsersService) {}

  async createAdmin(createAdminDto: CreateAdminDto) {
    const admin = await this.usersService.createUser({
      ...createAdminDto,
      roles: [ROLE_MAP.ADMIN],
    });

    return admin;
  }

  async updateAdminRoles(updateAdminRolesDto: UpdateAdminRolesDto) {
    const roles = updateAdminRolesDto.role ? [updateAdminRolesDto.role] : [];
    await this.usersService.updateRole({
      uuid: updateAdminRolesDto.uuid,
      roles,
    });
  }
}
