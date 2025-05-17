import { Body, Controller, Patch, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminRolesDto } from './dto/update-admin-role.dto';

@Controller('api/v1/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Patch('/role')
  async updateRoles(@Body() updateAdminRolesDto: UpdateAdminRolesDto) {
    return this.adminService.updateAdminRoles(updateAdminRolesDto);
  }

  @Post('/')
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }
}
